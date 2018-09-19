import React, {Component} from 'react';

import {
	View,
	ListView,
	StyleSheet,
	Text,
	AppRegistry,
	TouchableHighlight,
	TouchableOpacity,
	Image,
	Alert
} from 'react-native';

import SelectedImage from './SelectedImage';

export default class ViewPhotos extends Component{

	//Defining constructors
	constructor(props){
		super(props);
		this.states ={
			ds: new ListView.DataSource({
				rowHasChanged:(r1, r2) => r1 != r2
			}),
			showSelectedPhoto:false,
			uri:'' 
		};
	}

	//Defining render row function
	renderRow(rowData){
		const {uri} = rowData.node.image;
		return(
			<TouchableOpacity
				onPress = {()=>{
					this.states.showSelectedPhoto = true;
					this.states.uri = uri;
					this.setState({
						showSelectedPhoto : true,
						uri : uri
					})
				}}>
					<Image
						source = {{uri: rowData.node.image.uri}}
						style = {styles.image}/>

			</TouchableOpacity>
		);
	}

	render(){
		if(this.states.showSelectedPhoto){
			return(
				<SelectedImage
					uri={this.states.uri}
					User_Email = {this.props.Passed2_Email}
					User_Account_Name = {this.props.Passed2_Account_Name}
					User_Password = {this.props.Passed2_Password}/>
			);
		}
		else{
			return(
				<View style = {styles.container}>
					<View style ={styles.container_header_title}>
						<Text style = {{fontSize:20, fontWeight:'600', color:'#3498DB'}}>Choose An Image </Text>
					</View>
					<ListView
						contentContainerStyle={styles.container_list}
						dataSource={this.states.ds.cloneWithRows(this.props.photoArray)}
						renderRow = {(rowData) => this.renderRow(rowData)}
						enableEmptySections={true}/>
				</View>
			);
		}
	}
}


const styles=StyleSheet.create({
	container:{
		flex:1,
		backgroundColor:'#FDFEFE'
	},
	container_header_title:{
		alignItems:'center',
		marginTop:15
	},
	container_list:{
		flexDirection:'row',
		flexWrap:'wrap'
	},
	image:{
		width:100,
		height:100,
		marginLeft:20,
		marginTop:10,
		borderRadius:5,
		borderWidth:1,
		borderColor:'#979797'
	},
});