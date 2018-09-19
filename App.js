import React, {Component} from 'react';
import {
  View,
  AppRegistry,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  CameraRoll,
  RCTCameraRoll,
  Image,
  FlatList
} from 'react-native';

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

import {
  StackNavigator
} from 'react-navigation';

import firebase from 'react-native-firebase'

import ViewPhotos from './ViewPhotos';

firebase.initializeApp({
  apiKey : "AIzaSyD5_IXk5NuY2iUwvBw4z7qMc9DBJN5_0EM",
  authDomain : "relatethem.firebaseapp.com",
  databaseURL : "https://relatethem.firebaseio.com/",
  projectId:"relatethem"
});

//Firebase fatabase reference
var database = firebase.database();
//Within family
var radio_props = [
  {label: 'Father', value: 'Father' },
  {label: 'Mother', value: 'Mother' },
  {label: 'Son', value: 'Son'},
  {label: 'Daughter', value: 'Daughter'},
  {label: 'Sister', value: 'Sister'},
  {label: 'Brother', value: 'Brother'},
  {label: 'Husband', value: 'Husband'},
  {label: 'Wife', value: 'Wife'}
];


class HomeScreen extends Component{
  render(){
    return(
      <View style={styles.container}>
        <Text style={styles.welcome_text}>
          Welcome To RelateThem
        </Text>
        <Text style={styles.description_text}>
          Relate any body anytime anywhere
        </Text>
        <View style={styles.agree_container}>
          <Text style={styles.agree_text}>
            Press "Continue" to accept the
          </Text>
          <Text style={styles.agree_text}>
            RelateThem Terms of Service and
          </Text>
          <Text style={styles.agree_text}>
            Privacy Policy
          </Text>
        </View>
        <TouchableOpacity
          style={styles.continue_button}
          onPress={() => this.props.navigation.navigate('SignRegister')}>
          <Text style={styles.button_text}>Continue</Text>
        </TouchableOpacity>
      </View>
      )
  }
} 

//SignRegister class
class SignRegister extends Component{

    constructor(props){
    super(props);
    this.state = {
      Email: '',
      Password:'',
    };
  }

  SignIn_Email_Password = (Email, Password) => {
    firebase.auth().signInAndRetrieveDataWithEmailAndPassword(Email, Password)
      .then(() => this.props.navigation.navigate('Profile'))
      .catch(function(error){
        var errorCode = error.code;
        var errorMessage = error.message;
        Alert.alert("Sorry email and password didn't match");
      })
  }

  render(){
    return(
      <View style={styles.container}>
        <Text style={styles.welcome_text}>Sign In</Text>
        <TextInput 
          placeholder="               Enter Your Email"
          style={styles.SignIn_Email}
          onChangeText = {(Email) => this.setState({Email})}/>
        <TextInput
          placeholder="            Enter Your Password"
          style={styles.SignIn_Password}
          onChangeText = {(Password) => this.setState({Password})}/>
        <TouchableOpacity
          style={styles.SignIn_Btn}
          onPress = {() => this.SignIn_Email_Password(this.state.Email, this.state.Password)}>
          <Text style={styles.SignIn_Btn_Text}>SignIn</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.SignUp_Btn}
          onPress={() => this.props.navigation.navigate('SignUp')}>
          <Text style={styles.SignUp_Btn_Text}>Don't have account?</Text>
        </TouchableOpacity>
      </View>
      )
  }
}

//Screen for signup
class SignUpScreen extends Component{

  constructor(props){
    super(props);
    this.state = {
      Email: '',
      AccountName:'',
      Password:'',
      RePassword:'',
    };
  }

  Submit_Info = () => {
    Submit_Email = this.state.Email;
    Submit_Account_Name = this.state.AccountName;
    Submit_Password = this.state.Password;
    Submit_RePassword = this.state.RePassword;

    if(Submit_Password == Submit_RePassword){
      this.props.navigation.navigate('ImageUpload', {
        User_Email: Submit_Email,
        User_Account_Name: Submit_Account_Name,
        User_Password: Submit_Password,
      });
    }
    else{
      Alert.alert("Sorry Password didn't match!");
    }
  }


  render(){
    return(
      <View style={styles.container}>
        <Text style={styles.Register_Text}>Register Your Account</Text>
        <TextInput
          style={styles.SignUp_Email}
          placeholder="          Enter Your Email Address"
          onChangeText={(Email) => this.setState({Email})}/>
        <TextInput
          style={styles.SignUp_Account}
          placeholder="          Enter Your Account Name"
          onChangeText={(AccountName) => this.setState({AccountName})}/>
        <TextInput
        style={styles.SignUp_Password}
          placeholder="                  Enter Password"
          onChangeText={(Password) => this.setState({Password})}/>
        }
        <TextInput
          style={styles.SignUp_RePassword}
          placeholder="                Re-enter Password"
          onChangeText={(RePassword) => this.setState({RePassword})}/>

        <TouchableOpacity
          style={styles.Next_Btn}
            onPress={()=>this.Submit_Info()}>
            <Text style={styles.Next_Btn_Text}>Next</Text>
        </TouchableOpacity>
      </View>
      )
  }
}


//Class for image uploading
class ImageUpload_Screen extends Component{
  static navigationOptions = {
    title:'',
    headerStyle:{
      backgroundColor:'#FDFEFE'
    },
  };

  state = {
    showPhotoGallery : false,
    photoArray: []
  }

  choose_image = ()=>{
    CameraRoll.getPhotos({
      first:20,
      assetType:'Photos'
    })
    .then(r=>{
      let photoArray = r.edges;

      this.setState({
        showPhotoGallery: true,
        photoArray: photoArray
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render(){

    //Getting the parameters passed
    const {navigation} = this.props;

    const Passed_Email = navigation.getParam('User_Email', 'email@gmail.com');
    const Passed_Account_Name = navigation.getParam('User_Account_Name', 'Account_Name');
    const Passed_Password = navigation.getParam('User_Password', 'Password');

    if(this.state.showPhotoGallery){
      return(
        <ViewPhotos
          photoArray = {this.state.photoArray}
          Passed2_Email = {Passed_Email}
          Passed2_Account_Name = {Passed_Account_Name}
          Passed2_Password = {Passed_Password}/>
        );
    }
    else{

      return(
        <View style={styles.container}>
          <Text style={styles.ImageUpload_Header}>Upload Your Image</Text>
          <TouchableOpacity
            style={styles.ImageUpload_Btn}
            onPress={this.choose_image}>
            <Text style={styles.ImageUpload_Btn_Text}>Choose Image</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }
}

//This one is profile
class Profile extends Component{


  constructor(props){
    super(props);
    this.state = {
      Email:'',
      Name:'',
      CropEmail:'',
      Relation:'',
      RelationEmail:'',
      Display:true,
    };
  }

  componentDidMount(){
    var user = firebase.auth().currentUser;
    var cropEmail1 = user.email.replace("@gmail.com",'');
    var cropEmail2 = cropEmail1.charAt(0).toUpperCase() + cropEmail1.slice(1);
    this.setState(() => {
      return{
        Email: user.email,
        CropEmail: cropEmail2,
      };
    });

    firebaseRef = database.ref('users/'+cropEmail2+'/UserName');
    firebaseRef.once('value').then(function(snapshot){
        SignIn_Name = snapshot.val();
        this.setState({
          Name: SignIn_Name
        });
    }.bind(this));

    firebaseRef2 = database.ref('users/'+cropEmail2+'/Relation');
    firebaseRef2.on('value',function(snapshot1){
      Relation = snapshot1.val();
      if(Relation == ''){
        this.setState({Display:true});
      }
      else{

        firebaseRef3 = database.ref('users/'+cropEmail2+'/Relation');
        firebaseRef3.on('value',function(snapshot2){
          RelationCreated = snapshot2.val();
          this.setState({Relation: RelationCreated});
        }.bind(this));

        firebaseRef4 = database.ref('users/'+cropEmail2+'/StartRelation_Email');
        firebaseRef4.on('value',function(snapshot3){
          RelatedEmail = snapshot3.val();
          this.setState({RelationEmail: RelatedEmail});
        }.bind(this));
        this.setState({Display:false});
      }
    }.bind(this));
  }

  render(){

    let pic = {
      uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'
    };

    const {Email} = this.state;

    //if(this.state.CheckValue == 0){
      //this.setState({CheckValue:1});
    //}

    if(this.state.Display){
      return(
      <View style={styles.container}>
        <Image
          source={pic}
          style={styles.image}/>
        <Text style={styles.Profile_Info_Header}>About You</Text>
        <Text>Name:-{this.state.Name}</Text>
        <Text>Email:-{Email}</Text>
        <Text style={styles.InitialRelation_Text}>Initial Relation</Text>
        <Text>You need to create initial relation</Text>
        <TouchableOpacity
          style={styles.Create_Relation_Btn}
          onPress = {()=> this.props.navigation.navigate('RelationChain')}>
          <Text style={styles.Create_Relation_Btn_Text}>Start Relation Chain</Text>
        </TouchableOpacity>
      </View>
      );
    }
    else{
      return(
      <View style={styles.container}>
        <Image
          source={pic}
          style={styles.image}/>
        <Text style={styles.Profile_Info_Header}>About You</Text>
        <Text>Name:-{this.state.Name}</Text>
        <Text>Email:-{Email}</Text>
        <Text style={styles.InitialRelation_Text}>Initial Relation</Text>
        <Text>{this.state.RelationEmail}</Text>
        <Text>{this.state.Relation}</Text>
        <Button
          onPress ={()=> this.props.navigation.navigate('RelationChain')}
          title="Change Initial Relation"
          style={styles.Change_Relation_Btn}/>
        <TouchableOpacity
          style={styles.Create_Relation_Btn}
          onPress={() => this.props.navigation.navigate('FindPeople')}>
          <Text style={styles.Create_Relation_Btn_Text}>Find People</Text>
        </TouchableOpacity>
      </View>
      );
    }
  }
}

//Starting a relation chain
class RelationChain extends Component{

  constructor(props){
    super(props);

    this.state = {
      Name_Array:[
      ],
      Name:'',
      Display: false,
      Display_Number:0,
      Email_Array:[
      ],
      Check_Email:[],
      Check_Value:0,
      Email_Index:0,
    };
  }


  Display_All = () =>{

      this.setState({Display_Number:0});
      this.setState({Name_Array:[]});
      this.setState({Display:false});
      this.setState({Email_Array:[]});

      firebaseRef = database.ref('users/Numbers');
      firebaseRef.once('value').then(function(snap){
        total_number = snap.val();
        for(i = 1; i<=total_number; i++){
          firebaseRef2 = database.ref('users/Email/' + i + '/Email' );
          firebaseRef2.once('value').then(function(snapshot){

            Retrieve_Email = snapshot.val();
            Check_Ema = this.state.Check_Email;
            Check_Ema.push(Retrieve_Email);
            this.setState({Check_Email: Check_Ema});


            firebaseRef3 = database.ref('users/'+Retrieve_Email+'/UserName');
            firebaseRef3.once('value').then(function(snapshot1){
              Retrieve_Name = snapshot1.val();
              
              if(Retrieve_Name == this.state.Name){

                Array_Email = this.state.Email_Array;
                //if(Array_Email.includes(Retrieve_Email)){
                if(Array_Email.includes(this.state.Check_Email[this.state.Check_Value])){
                  this.setState({Check_Value: this.state.Check_Value + 1});

                }
                else{

                  //Inserting Email
                  //Array_Email.push(Retrieve_Email);
                  Array_Email.push(this.state.Check_Email[this.state.Check_Value]);
                  this.setState({Email_Array: Array_Email});
                  //Inserting Name
                  Entry_Name = {key: Retrieve_Name};
                  Array_Name = this.state.Name_Array;
                  Array_Name.push(Entry_Name);
                  this.setState({Name_Array: Array_Name});

                  this.setState({Check_Value: this.state.Check_Value + 1});

                }

                this.setState({Display:true});
                Display_Num = this.state.Display_Number + 1;
                this.setState({Display_Number: Display_Num});
              }
              else{
                if(this.state.Display_Number == 0){


                this.setState({Name_Array:[]});
                this.setState({Display:false});
                this.setState({Email_Array:[]});
                this.setState({Check_Value: this.state.Check_Value + 1});
                }
                else{
                  this.setState({Check_Value: this.state.Check_Value + 1});
                }
              }
            }.bind(this));
          }.bind(this));
        }
      }.bind(this));
   // }

  }

  render(){

    let pic = {
      uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'

    };

      let name_list = this.state.Name_Array;

    if(this.state.Display){
      return(
      <View style={styles.container}>
      <Text>{this.state.Email_Array}</Text>
        <Text
          style={styles.StartRelation_Header}>Start Your Relation Chain</Text>
        <Text style={styles.StartRelation_Suggestion}>Enter the person name you want to relate</Text>
        <TextInput
          placeholder="Search..."
          onChangeText={(Name) => {
            this.setState({Name});
            this.Display_All();
          }}
          style={styles.SignIn_Email}/>   
        <Text>{this.state.Name}</Text>
        <View style={{marginTop:20}}>
        <FlatList
          data={this.state.Name_Array}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('CreateInitial_Relation', {
                itemEmail: this.state.Email_Array[index],
              })}
              >
            <View style={styles.RelatePerson_List}>
            <Image source={pic} style={{height:70, width:70,borderRadius:35, marginLeft:10,marginTop:5}}/>
              <Text style={styles.RelatePersonList_Header}>
                {item.key}
              </Text>
            </View>
            </TouchableOpacity>
            )}
          /> 
          </View>    
      </View>
      );
    }
    else{
     return(
      <View style={styles.container}>
        <Text></Text>
        <Text
          style={styles.StartRelation_Header}>Start Your Relation Chain</Text>
        <Text style={styles.StartRelation_Suggestion}>Enter the person name you want to relate</Text>
        <TextInput
          placeholder="Search..."
           onChangeText={(Name) => {
            this.setState({Name});
            this.Display_All();
           }} 
          style={styles.SignIn_Email}/>   
        <Text>{this.state.Name}</Text>
        <Text>Well Done</Text> 
      </View>
      );
    }
  }
}

class CreateInitial_Relation extends Component{

  constructor(props){
    super(props);
    this.state = {
      View_Email:'',
      User_Name:'',
      Check_Number:0,
      Relation:'',
      Relation_Check_Status:0,
    };
  }

  //Getting current user
  user = firebase.auth().currentUser;
  currentEmail = this.user.email.replace("@gmail.com",'');
  signInEmail = this.currentEmail.charAt(0).toUpperCase() + this.currentEmail.slice(1);


  //Function for radio form select
  _onSelect = (item) => {
    this.setState({Relation: item.toString()});
  }

  //Creating relation
  CreateRelation = () => {
      Create_Relation_Email = this.state.View_Email;
      firebaseRef_Initial = database.ref('users/'+this.signInEmail);
      var updates = {};
      updates['StartRelation_Email']= Create_Relation_Email;
      updates['Relation'] = this.state.Relation;
      firebaseRef_Initial.update(updates);
      firebaseRef_Initial.update(updates);

      //Navigating to profile screen
      this.props.navigation.navigate('Profile');
  }

  render(){

    const { navigation } = this.props;
    const User_Email_Get = navigation.getParam('itemEmail', 'email@gmail.com');

    let pic = {
      uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'
    };

    if(this.state.Check_Number == 0){
      this.setState({View_Email: User_Email_Get});
      firebaseRef = database.ref('users/'+User_Email_Get+'/UserName');
      firebaseRef.once('value').then(function(snapshot){
        User_Got_Name = snapshot.val();
        this.setState({User_Name: User_Got_Name});
      }.bind(this));
      this.setState({Check_Number: 1});
    }

    return(
      <View style={styles.container}>
          <Image
          source={pic} style={styles.InitialPerson_Image}/>
          <Text style={{marginTop:30,fontSize:17,color:'#3498DB'}}>{this.state.User_Name}</Text>
          <Text style={{marginTop:30}}>What is you relation?</Text>
          <RadioForm

            formHorizontal={false}
            labelHorizontal={true}
            animation={true}
            radio_props={radio_props}
            intial={0}
            onPress={(item)=> this._onSelect(item)}
            style={{marginTop:10,width:100,marginLeft:0}}/>
          <TouchableOpacity style={styles.create_initial_relation_btn}
            onPress={()=> this.CreateRelation()}>
            <Text style={{marginTop:10,marginLeft:30, color:'#3498DB'}}>Create Above Relation</Text>
          </TouchableOpacity>
      </View>
      );
  }
}

//Finding people and knowing relation
class FindPeople extends Component{

  constructor(props){
    super(props);
    this.state ={
      Name_Array:[
      ],
      Name:'',
      Display: false,
      Display_Number:0,
      Email_Array:[
      ],
      Check_Email:[],
      Check_Value:0,
      Email_Index:0,
    };
  }

  Display_All = () =>{

      this.setState({Display_Number:0});
      this.setState({Name_Array:[]});
      this.setState({Display:false});
      this.setState({Email_Array:[]});

      firebaseRef = database.ref('users/Numbers');
      firebaseRef.once('value').then(function(snap){
        total_number = snap.val();
        for(i = 1; i<=total_number; i++){
          firebaseRef2 = database.ref('users/Email/' + i + '/Email' );
          firebaseRef2.once('value').then(function(snapshot){

            Retrieve_Email = snapshot.val();
            Check_Ema = this.state.Check_Email;
            Check_Ema.push(Retrieve_Email);
            this.setState({Check_Email: Check_Ema});


            firebaseRef3 = database.ref('users/'+Retrieve_Email+'/UserName');
            firebaseRef3.once('value').then(function(snapshot1){
              Retrieve_Name = snapshot1.val();
              
              if(Retrieve_Name == this.state.Name){

                Array_Email = this.state.Email_Array;
                //if(Array_Email.includes(Retrieve_Email)){
                if(Array_Email.includes(this.state.Check_Email[this.state.Check_Value])){
                  this.setState({Check_Value: this.state.Check_Value + 1});

                }
                else{

                  //Inserting Email
                  //Array_Email.push(Retrieve_Email);
                  Array_Email.push(this.state.Check_Email[this.state.Check_Value]);
                  this.setState({Email_Array: Array_Email});
                  //Inserting Name
                  Entry_Name = {key: Retrieve_Name};
                  Array_Name = this.state.Name_Array;
                  Array_Name.push(Entry_Name);
                  this.setState({Name_Array: Array_Name});

                  this.setState({Check_Value: this.state.Check_Value + 1});

                }

                this.setState({Display:true});
                Display_Num = this.state.Display_Number + 1;
                this.setState({Display_Number: Display_Num});
              }
              else{
                if(this.state.Display_Number == 0){


                this.setState({Name_Array:[]});
                this.setState({Display:false});
                this.setState({Email_Array:[]});
                this.setState({Check_Value: this.state.Check_Value + 1});
                }
                else{
                  this.setState({Check_Value: this.state.Check_Value + 1});
                }
              }
            }.bind(this));
          }.bind(this));
        }
      }.bind(this));
  }

  render(){

    let pic={
      uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'
    };

    if(!this.state.Display){
      return(
        <View style={styles.container}>
          <Text>Know Your Relation</Text>
          <TextInput
            placeholder="Search People..."
            style={styles.FindPeople_TextInput}
            onChangeText={(Name) => {
              this.setState({Name});
              this.Display_All();
            }}/>
          <Text>{this.state.Name}</Text>
        </View>
      );
    }
    else{
      return(
        <View style={styles.container}>
          <Text>Know Your Relation</Text>
          <TextInput
            placeholder="Search People..."
            style={styles.FindPeople_TextInput}
            onChangeText={(Name) => {
              this.setState({Name});
              this.Display_All();
            }}/>
          <Text>{this.state.Name}</Text>

        <View style={{marginTop:20}}>
          <FlatList
            data={this.state.Name_Array}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('ShowRelation', {
                  itemEmail: this.state.Email_Array[index],
                })}
                >
              <View style={styles.RelatePerson_List}>
              <Image source={pic} style={{height:70, width:70,borderRadius:35, marginLeft:10,marginTop:5}}/>
                <Text style={styles.RelatePersonList_Header}>
                  {item.key}
                </Text>
              </View>
              </TouchableOpacity>
              )}
            /> 
            </View> 
          </View>
      );
    }
  }
}

//Show relation screen
class ShowRelation extends Component{

  constructor(props){
    super(props);
    this.state={
      ShowEmail:'',
      ShowName:'',
      MyEmail:'',
      LoopEmail:'',
      RelationArray:[],
      TotalRelation:0,
      FinalRelation:'',
      finiteLoop:0,
    };
  }

  //Calculates the relations
  RelationOperation(){
    if(this.state.ShowEmail != this.state.LoopEmail){
      this.componentWillReceiveProps();
    }
    else{
      Get_ArrayRelation = this.state.RelationArray;
      length = Get_ArrayRelation.length;
      for(i=0;i<length;i++){
        //Main algorithm for final relation
          if(this.state.RelationArray[i] == 'Sister' && this.state.RelationArray[i+1] == 'Mother'){

            j = i + 1;
            if(this.state.RelationArray[j+1] != undefined){
              if(this.state.RelationArray[j] == 'Mother' && this.state.RelationArray[j+1]=='Husband'){
                if(this.state.RelationArray[j+2] != undefined){
                  if(this.state.RelationArray[j+1]=='Husband' && this.state.RelationArray[j+2]=='Son'){
                    ArrayRelation = this.state.RelationArray;
                    ArrayRelation[i]='Mother';
                    ArrayRelation[j]='Father';
                    ArrayRelation[j+1]='Son';
                    ArrayRelation.splice(-1,1);
                    this.setState({RelationArray: ArrayRelation});
                    this.RelationOperation();
                  }
                }
                else{
                  ArrayRelation = this.state.RelationArray;
                  ArrayRelation[i] = 'Mother';
                  ArrayRelation[j] = 'Father';
                  ArrayRelation.splice(-1,1);
                  this.setState({RelationArray: ArrayRelation});
                  this.RelationOperation();
                }        
              }
            }
            else{
              this.setState({FinalRelation: 'Mother'});
            }
          }

          if(this.state.RelationArray[i] == 'Mother' && this.state.RelationArray[i+1] == 'Father'){
            j = i + 1;
            if(this.state.RelationArray[j+1] != undefined){
              if(this.state.RelationArray[j]=='Father' && this.state.RelationArray[j+1]=='Son'){
                ArrayRelation = this.state.RelationArray;
                ArrayRelation[i] = 'Father';
                ArrayRelation[j] = 'Brother';
                ArrayRelation.splice(-1,1);
                this.setState({RelationArray: ArrayRelation});
                this.RelationOperation();
              }

            }
            else{
              this.setState({FinalRelation: 'Father'});
            }
          }

          if(this.state.RelationArray[i]=='Father' && this.state.RelationArray[i+1]=='Brother'){
            this.setState({FinalRelation:'Brother'});
          }
      }
      return;
    }
  }

  componentWillReceiveProps(){
    
    firebaseRef5 = database.ref('users/'+this.state.LoopEmail+'/StartRelation_Email');
    firebaseRef5.once('value').then(function(snapshot3){
      StartRelationEmail = snapshot3.val();
      firebaseRef6 = database.ref('users/'+this.state.LoopEmail+'/Relation');
      firebaseRef6.once('value').then(function(snapshot4){
        StartRelation1 = snapshot4.val();
        Array_Relation = this.state.RelationArray;
        Array_Relation.push(StartRelation1);
        this.setState({RelationArray: Array_Relation});
        //Alert.alert(StartRelation1);
        this.setState({LoopEmail:StartRelationEmail});
        this.RelationOperation();
      }.bind(this));
    }.bind(this));
  }

  render(){
    let pic={
      uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'
    };

    const {navigation} = this.props;
    const Show_Email = navigation.getParam("itemEmail","email@gmail.com");

    if(this.state.finiteLoop == 0){
      this.setState({
        ShowEmail: Show_Email
      });
      firebaseRef = database.ref('users/'+Show_Email+'/UserName');
      firebaseRef.once('value').then(function(snapshot){
        Show_Name = snapshot.val();
        this.setState({
          ShowName: Show_Name
        });
      }.bind(this));

      //Getting current SignedIn User
      user = firebase.auth().currentUser;
      Email = user.email;
      Email1 = Email.replace("@gmail.com",'');
      Email2 = Email1.charAt(0).toUpperCase() + Email1.slice(1);
      this.setState({MyEmail: Email2});

      //Finding initial Relation
      firebaseRef3 = database.ref('users/'+Email2+'/StartRelation_Email');
      firebaseRef3.once('value').then(function(snapshot1){

        InitialRelation_Email = snapshot1.val();
        this.setState({LoopEmail: InitialRelation_Email});

        if(InitialRelation_Email == this.state.ShowEmail){
          firebaseRef4 = database.ref('users/'+this.state.MyEmail+'/Relation');
          firebaseRef4.once('value').then(function(snapshot2){
            Relation = snapshot2.val();
            this.setState({FinalRelation: Relation});
          }.bind(this));
        }
        else{

          firebaseRef34 = database.ref('users/'+this.state.MyEmail+'/Relation');
          firebaseRef34.once('value').then(function(snapshot34){
            Relation34 = snapshot34.val();
            Array_Relation34 = this.state.RelationArray;
            Array_Relation34.push(Relation34);
            this.setState({RelationArray: Array_Relation34});
            this.componentWillReceiveProps();
          }.bind(this));
        }
      }.bind(this));
      this.setState({finiteLoop:1});
    }

    return(
      <View style={styles.container}>
        <Image source={pic} style={styles.InitialPerson_Image}/>
        <Text style={{marginTop:30,fontSize:17,color:'#3498DB'}}>{this.state.ShowName}</Text>
        <Text style={{marginTop:30,fontSize:17,color:'#3498DB'}}>Relation</Text>
        <Text style={{marginTop:5, fontSize:15}}>{this.state.FinalRelation}</Text>
      </View>
      );
  }
}

export default class MainClass extends Component{

  render(){

    return(
      <RootStack/>
      );
  }
}


const RootStack=StackNavigator({
  SignRegister:{
    screen: SignRegister
  },
  Welcome:{
    screen: HomeScreen
  },
  SignUp:{
    screen: SignUpScreen
  },
  ImageUpload:{
    screen: ImageUpload_Screen
  },
  Profile:{
    screen:Profile
  },
  RelationChain:{
    screen: RelationChain
  },
  CreateInitial_Relation:{
    screen: CreateInitial_Relation
  },
  FindPeople:{
    screen: FindPeople
  },
  ShowRelation:{
    screen: ShowRelation
  },
},
{
  initialRouteName: "Welcome",
});

const styles = StyleSheet.create({
  container:{
    backgroundColor: '#FDFEFE',
    flex:1,
    alignItems:'center'
  },
  universal_button:{
    backgroundColor:'#3498DB',
    borderColor:'#3498DB',
    borderWidth:1,
    marginTop:30,
    height:40,
    alignItems:'center',
    borderRadius:10,
    width:200
  },
  welcome_text:{
    marginTop: 100,
    fontSize: 23,
    color: '#3498DB'
  },
  description_text:{
    marginTop: 200,
    fontSize: 20
  },
  agree_container:{
    paddingTop:10,
    alignItems:'center'
  },
  agree_text:{
    color:'#909497'
  },
  continue_button:{
    backgroundColor:'#FDFEFE',
    borderColor:'#3498DB',
    borderWidth:1,
    borderRadius:50,
    height:40,
    alignItems:'center',
    marginTop: 50,
    width: 200
  },
  button_text:{
    color: '#3498DB',
    marginTop:10
  },
  SignIn_Email:{
    marginTop:30,
    height:40,
    width:250,
    borderColor:'#CACFD2',
    borderWidth:1,
    borderRadius:5

  },
  SignIn_Password:{
    marginTop:20,
    height:40,
    width:250,
    borderColor:'#CACFD2',
    borderWidth:1,
    borderRadius:5    
  },
  SignIn_Btn:{
    backgroundColor:'#3498DB',
    borderColor:'#3498DB',
    borderWidth:1,
    borderRadius:10,
    height:40,
    alignItems:'center',
    marginTop: 50,
    width: 150
  },
  SignIn_Btn_Text:{
    color: '#FDFEFE',
    marginTop:10
  },
  SignUp_Btn:{
    marginTop:20
  },
  SignUp_Btn_Text:{
    color:'#3498DB'
  },
  Register_Text:{
    marginTop:40,
    color : '#3498DB',
    fontSize:20
  },
  SignUp_Email:{
    marginTop:20,
    height:40,
    width:250,
    borderColor:'#CACFD2',
    borderWidth:1,
    borderRadius:5
  },
  SignUp_Account:{
    marginTop:20,
    height:40,
    width:250,
    borderColor:'#CACFD2',
    borderWidth:1,
    borderRadius:5
  },
  SignUp_Password:{
    marginTop:20,
    height:40,
    width:250,
    borderColor:'#CACFD2',
    borderWidth:1,
    borderRadius:5
  },
  SignUp_RePassword:{
    marginTop:20,
    height:40,
    width:250,
    borderColor:'#CACFD2',
    borderWidth:1,
    borderRadius:5
  },
  Next_Btn:{
    backgroundColor:'white',
    borderColor:'#3498DB',
    borderWidth:1,
    borderRadius:10,
    height:40,
    alignItems:'center',
    marginTop: 50,
    width: 150
  },
  Next_Btn_Text:{
    color: '#3498DB',
    marginTop:10
  },
  ImageUpload_Header:{
    color:'#3498DB',
    fontSize:18
  },
  ImageUpload_Btn:{
    backgroundColor:'#3498DB',
    height:40,
    width:150,
    marginTop:30,
    alignItems:'center',
    borderRadius:10
  },
  ImageUpload_Btn_Text:{
    color:'white',
    fontSize:15,
    marginTop:10
  },
  image:{
    marginBottom:30,
    borderRadius:100,
    borderColor:'#3498DB',
    height:200,
    width:200
  },
  Profile_Info_Header:{
    color:'#3498DB',
    fontSize:20,
  },
  Create_Relation_Btn:{
    backgroundColor:'#FDFEFE',
    borderColor:'#3498DB',
    borderWidth:1,
    borderRadius:50,
    height:40,
    alignItems:'center',
    marginTop: 50,
    width: 200
  },
  Create_Relation_Btn_Text:{
    color: '#3498DB',
    marginTop:10

  },

  StartRelation_Header:{
    color:'#3498DB',
    fontSize:18,
  },
  StartRelation_Suggestion:{
    marginTop:40,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  RelatePerson_List:{
    flex:1,
    flexDirection:'row',
    borderColor:'#D0D3D4',
    borderWidth:1,
    height:80,
    width:400,
  },
  RelatePersonList_Header:{
    fontSize:16,
    marginLeft:15,
    marginTop:10,
    color:'#3498DB'
  },
  InitialPerson_Image:{
    height:60,
    width:60,
    borderRadius:30,
    marginTop:10
  },
  create_initial_relation_btn:{
    marginTop:30,
    height:40,
    width:200,
    borderWidth:1,
    borderColor:'#3498DB',
    borderRadius:10
  },
  InitialRelation_Text:{
    marginTop:30,
    color:'#3498DB',
    fontSize:15
  },
  Change_Relation_Btn:{
    marginTop:50
  },
  FindPeople_TextInput:{
    marginTop:20,
    height:40,
    width:250,
    borderColor:'#CACFD2',
    borderWidth:1,
    borderRadius:5
  }
})

