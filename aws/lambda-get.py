import boto3

dynamodb = boto3.client('dynamodb', region_name='ca-central-1')

def lambda_handler(event, context):
    # Get query parameter (if provided)
    software_type = event.get('queryStringParameters', {}).get('type', None)
    
    # Define the parameters for querying DynamoDB (if filtering by type)
    if software_type:
        params = {
            'TableName': 'software-listings',
            'KeyConditionExpression': 'Type = :softwareType',
            'ExpressionAttributeValues': {
                ':softwareType': {'S': software_type}
            }
        }
    else:
        params = {
            'TableName': 'software-listings'
        }

    try:
        # If software_type exists, use query, otherwise, scan
        if software_type:
            response = dynamodb.query(**params)
        else:
            response = dynamodb.scan(**params)
        
        items = response.get('Items', [])
        
        return {
            'statusCode': 200,
            'body': items
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': str(e)
        }
