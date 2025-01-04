import { CognitoUserPool } from 'amazon-cognito-identity-js';

const UserPool = new CognitoUserPool({
    UserPoolId: 'ca-central-1_JAgJn2W8c',
    ClientId: '44tuq3pdkcpcuj4ap69qkefoi0'
  });
  
  export default UserPool;