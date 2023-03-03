import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import {
    fromCognitoIdentityPool,
} from "@aws-sdk/credential-provider-cognito-identity";
import { Polly } from "@aws-sdk/client-polly";
import { getSynthesizeSpeechUrl } from "@aws-sdk/polly-request-presigner";
//Parser
const parser = new DOMParser()
// Set the parameters
const speechParams = {
    OutputFormat: "mp3",
    SampleRate: "16000", 
    Text: "",
    TextType: "text", 
    VoiceId: "Joey" // For example, "Matthew"
};

const client = new Polly({
    region: `${process.env.REACT_APP_AWS_REGION}`,
    credentials: fromCognitoIdentityPool({
        client: new CognitoIdentityClient({ region: `${process.env.REACT_APP_AWS_REGION}` }),
        identityPoolId: `${process.env.REACT_APP_AWS_REGION}:${process.env.REACT_APP_AWS_POOL_ID}` // IDENTITY_POOL_ID
    }),
});


const speakText = async (text: string) => {
    speechParams.Text =  `${parser.parseFromString(text, "text/html").body.textContent}`

    try {
        let url = await getSynthesizeSpeechUrl({
            client, params: speechParams
        });

        return url;
    } catch (err) {
        console.log("Error", err);
        return "";
    }
};





export default speakText;

