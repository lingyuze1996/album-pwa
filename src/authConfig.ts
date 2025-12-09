import { Amplify } from 'aws-amplify';

const awsConfig = {
  Auth: {
    Cognito: {
      // REQUIRED - Amazon Cognito Region
      region: 'ap-southeast-2',
      // OPTIONAL - Amazon Cognito User Pool ID
      userPoolId: 'ap-southeast-2_8wQY7je7w',
      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolClientId: '167mflnhlhg0oeim763iks53ec',
    },
  },
};

Amplify.configure(awsConfig);

export default awsConfig;
