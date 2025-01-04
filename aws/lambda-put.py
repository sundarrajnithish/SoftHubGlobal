import boto3
import time

# Initialize DynamoDB client
dynamodb = boto3.client('dynamodb', region_name='ca-central-1')

def lambda_handler(event, context):
    # Define the parameters to put an item in DynamoDB
    params = {
        'Item': {
            'SL': {
                'S': 'Windows X'
            },
            'Type': {
                'S': 'OS'
            },
            'Time': {
                'S': str(int(time.time() * 1000))  # Current timestamp in milliseconds
            }
        },
        'TableName': 'software-listings'
    }
    
    # Put item into DynamoDB table
    try:
        response = dynamodb.put_item(**params)
        return {
            'statusCode': 200,
            'body': response
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': str(e)
        }
