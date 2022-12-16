import React, { useState } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { Auth } from 'aws-amplify';


// Import Amplify and Storage
import Amplify, { Storage } from 'aws-amplify';
// withAuthenticator is a higher order component that wraps the application with a login page
import { withAuthenticator } from '@aws-amplify/ui-react';
// Import the project config files and configure them with Amplify
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

Storage.configure({
  customPrefix: {
      public: 'prescriptions/',

  },
})

const App = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploaded, setuploaded] = useState(false);


  const downloadUrl = async () => {
    // Creates download url that expires in 5 minutes/ 300 seconds
    const downloadUrl = await Storage.get('picture.jpg', { expires: 300 });
    window.location.href = downloadUrl
  }

  const handleChange = async (e) => {
    const file = e.target.files[0];
    try {
      let filename = uuidv4();
      setLoading(true);
      // Upload the file to s3 with private access level. 
      await Storage.put(filename + '.jpg', file, {
        level: 'public',
        contentType: 'image/jpg'
      });
      // Retrieve the uploaded file to display
      const url = await Storage.get(filename + '.jpg')
      setImageUrl(url);
      setLoading(false);
      setuploaded(true)
    } catch (err) {
      console.log("failed to upload image", err);
    }
  }

  return (
    <div className="App">
      <h1> AnyCompany Patient Portal</h1>
      <h2> Upload an Image </h2>
      {loading ? <h3>Uploading...</h3> : <input
        type="file" 
        onChange={(evt) => handleChange(evt)}
      />}

      {uploaded && <p style={{color: "green"}}>
        Upload Successfull!</p>}
      
      <button onClick={async()=>{
        await Auth.signOut()
      }}>Sign Out</button>

      {/* <div>
        {imageUrl ? <img style={{ width: "30rem" }} src={imageUrl} /> : <span />}
      </div>
      <div>
        <h2>Download URL?</h2>
        <button onClick={() => downloadUrl()}>Click Here!</button>
      </div> */}
    </div>
  );
}

// withAuthenticator wraps your App with a Login component
export default withAuthenticator(App);