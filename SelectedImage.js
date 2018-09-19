import React, {Component} from 'react';

import {
	View,
	AppRegistry,
	Text,
	TextInput,
	Image,
	StyleSheet,
	TouchableOpacity,
	Button,
	ActivityIndicator,
	Alert
} from 'react-native';


import {
	StackNavigator
} from 'react-navigation';

import RNFetchBlob from 'react-native-fetch-blob';

import firebase from 'react-native-firebase';
import {NativeModules} from 'react-native';

firebase.initializeApp({
	apiKey : "AIzaSyD5_IXk5NuY2iUwvBw4z7qMc9DBJN5_0EM",
	authDomain : "relatethem.firebaseapp.com",
	databaseURL : "https://relatethem.firebaseio.com/",
	projectId:"relatethem",
	storageBucket:"gs://relatethem.appspot.com"
});

var database = firebase.database();
//Firebase storage is not working
//var storage  = firebase.storage();



/*const SelectedPhoto = (props) => {


	const {uri, User_Email, User_Account_Name, User_Password} = props;

	return(

		<View style={styles.container}>
			<Image
				source={{uri: props.uri}}
				style={styles.image}/>
			<Button
				title = "Accress Your Location"
				onPress = {()=> {}}/>
			<TouchableOpacity
				onPress={()=>{}}
				style = {styles.start_btn}>
				<Text
					style = {styles.container_btn_text}>Start using RelateThem</Text>
			</TouchableOpacity>
		</View>
	);
}*/

class SelectedPhoto extends Component{

	showMessage = () => {
		Alert.alert('Done');
	}


	handleSignup = (email, password) =>{
		firebase
			.auth()
			.createUserAndRetrieveDataWithEmailAndPassword(email, password)
			.then(()=>{Alert.alert('Registration done, please login to use!');})
			.catch(error => this.setState({ errorMessage: error.message}))
		var emailId = email.replace("@gmail.com","");
		this.writeUserData(emailId, this.props.User_Account_Name);

		const image = this.props.uri;
		const Blob = RNFetchBlob.polyfill.Blob
		const fs = RNFetchBlob.fs
		window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
		window.Blob = Blob
		//firebase.storage().child(emailId).child('Image')
		//this.uploadImage(image)
	}

	uploadImage = (uri, mime = 'application/octet-stream') => {
		return (dispatch) => {
			return new Promise((resolve, reject)=>{
				const uploadUri = Platform.OS === 'ios'? uri.replace('file://',''):uri
				const sessionId = new Date().getTime()
				let uploadBlob = null

				//Create firebsae storage reference
				const imageRef = firebase.storage().ref('subediashish35').child('Image')

				//encode data to base64 prior to uploading
				fs.readFile(uploadUri, 'base64')
				.then((data)=>{
					uploadBlob = blob;
					return imageRef.put(blob, {contentType : mime})
				})

				//from here you can get the donwload uri of the image
				//to store a refernce to it in the database
				.then(()=>{
					uploadBlob.close()
					return imageRef.getDownloadURL()
				})
				.then((url)=>{
					resolve(url)
					//this storeReference function is an optional helper
					//methdo you can create to store a refernce to the download url
					//of the image in your database
					storeReference(url, sesionId)
				})
				.catch((error)=>{
					reject(error)
				})

			});
		}
	}

	//Handling database insertion
	writeUserData = (email, Account_Name) => {

		//Wrting users information
		database.ref('users/' + email ).set({
			UserName: Account_Name, 
			ProfilePicture:'',
			StartRelation_Email: '',
			Relation:''
		});

		Alert.alert('Done');


		//Getting total number of users
		firebaseRef_Number = database.ref('users/Numbers');
		firebaseRef_Number.once('value').then(function(snapshot){
			Total_Number = snapshot.val();
			Insert_Number = Total_Number + 1;
			databaseRef_Email = database.ref('users/Email/' + Insert_Number);
			databaseRef_Email.set({
				Email: email
			});

			databaseRef_TotalNumber = database.ref('users');
			var updates = {};
			updates['Numbers'] = Total_Number + 1;
			databaseRef_TotalNumber.update(updates);
		});
	}

	render(){
		return(
			<View style={styles.container}>
			<Text>{this.props.User_Email}</Text>
				<Image
					source={{uri: this.props.uri}}
					style={styles.image}/>
				<Button
					title = "Accress Your Location"
					onPress = {()=>{}}/>
				<TouchableOpacity
					onPress={()=> {this.handleSignup(this.props.User_Email, this.props.User_Password)}}
					style = {styles.start_btn}>
					<Text
						style = {styles.container_btn_text}>Register</Text>
				</TouchableOpacity>
			</View>
		);
	}
}


const styles = StyleSheet.create({
	container:{
		flex:1,
		justifyContent : 'center',
		alignItems : 'center',
		backgroundColor : '#FDFEFE'
	},
	image:{
		marginBottom:30,
		borderRadius:100,
		borderColor:'#3498DB',
		height:200,
		width:200
	},
	start_btn:{
		marginBottom:150,
		height:40,
		width:200,
		borderColor:'#3498DB',
		borderWidth:1,
		backgroundColor:'#FDFEFE',
		alignItems : 'center',
		borderRadius:50,
		marginTop:20
	},
	container_btn_text:{
		color: '#3498DB',
		paddingTop:10
	},

});

export default SelectedPhoto;