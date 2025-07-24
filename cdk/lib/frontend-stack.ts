// lib/frontend-stack.ts
import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import * as path from 'path';
import * as cr from 'aws-cdk-lib/custom-resources';
export class FrontendStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const apiUrl = cdk.Fn.importValue("TodoApiBaseUrl");

        const websiteBucket = new s3.Bucket(this, 'ReactAppBucket', {
            publicReadAccess: false,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });


        const oai = new cloudfront.OriginAccessIdentity(this, 'OAI');

        websiteBucket.grantRead(oai);

        const distribution = new cloudfront.Distribution(this, 'Distribution', {
            defaultBehavior: {
                origin: new origins.S3Origin(websiteBucket, {
                    originAccessIdentity: oai,
                }),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
            defaultRootObject: 'index.html',
            errorResponses: [
                {
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html',
                    ttl: cdk.Duration.minutes(1),
                },
            ],
        });
        const deployment = new s3deploy.BucketDeployment(this, 'DeployWebsite', {
            sources: [
                s3deploy.Source.asset(
                    path.join(__dirname, '../../frontend/dist')
                ),
            ],
            destinationBucket: websiteBucket,
            distribution,
            distributionPaths: ['/*'],
        })

        const effect = {
            service: 'S3',
            action: 'putObject',
            parameters: {
                Bucket: websiteBucket.bucketName,
                Key: 'config.json',
                Body: `{"apiUrl":"${apiUrl}"}`,
                ContentType: 'application/json',
                CacheControl: 'max-age=60',
            },
            physicalResourceId: cr.PhysicalResourceId.of(new Date().toISOString()),
        }
        const putConfig = new cr.AwsCustomResource(this, 'PutConfigJson', {
            onCreate: effect,
            onUpdate: effect,
            policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
                resources: [websiteBucket.arnForObjects('config.json')],
            }),
        });

        putConfig.node.addDependency(deployment);
        putConfig.node.addDependency(distribution);

        new cdk.CfnOutput(this, 'BucketURL', {
            value: websiteBucket.bucketWebsiteUrl,
        });

        new cdk.CfnOutput(this, "CloudFrontURL", {
            value: `https://${distribution.domainName}`,
        })


    }
}
