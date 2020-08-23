import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}
const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})

class RenderDish extends Component {
    constructor(props){
        super(props);
        this.state = {
            rating: 0,
            author: '',
            comment: '',
            showModal: false
        };
    }

    toggleModal(){
        this.setState({
            showModal: !this.state.showModal
        });
    }
    ratingCompleted(rating){
        this.setState({rating: rating});
    }
    handleSubmit(){
        console.log(JSON.stringify(this.state));
        this.props.postComment(this.state.rating, this.state.author, this.state.comment);
        this.toggleModal();
    }

    render(){
        const dish = this.props.dish;

        if (dish != null) {
            return(
                <>
                    <Card
                        featuredTitle={dish.name}
                        image={{uri: baseUrl + dish.image}}>
                            <Text style={{margin: 10}}>
                                {dish.description}
                            </Text>
                            <View style={styles.icon}>
                                <Icon
                                    raised
                                    reverse
                                    name={ this.props.favorite ? 'heart' : 'heart-o'}
                                    type='font-awesome'
                                    color='#f50'
                                    onPress={() => this.props.favorite ? console.log('Already favorite') : this.props.onPress()}
                                />
                                <Icon
                                    raised
                                    reverse
                                    name='pencil'
                                    type='font-awesome'
                                    color='#512DA8'
                                    onPress={() => this.toggleModal()}
                                />
                            </View>
                    </Card>
                    <Modal
                        animationType = {"slide"}
                        transparent = {false}
                        visible = {this.state.showModal}
                        onDismiss = {() => this.toggleModal() }
                        onRequestClose = {() => this.toggleModal() }
                        >
                        <View style = {styles.modal}>
                            <Rating
                                showRating
                                onFinishRating={(rating) => this.ratingCompleted(rating)}
                                style={{ paddingVertical: 10 }}
                                />
                            <Input
                                placeholder="Author"
                                leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                                style={styles}
                                onChangeText={value => this.setState({ author: value })}
                                />
                            <Input
                                placeholder="Comment"
                                leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                                style={styles}
                                onChangeText={value => this.setState({ comment: value })}
                                />
                            <View style={{margin:10}}>
                                <Button 
                                    onPress = {() => this.handleSubmit()}
                                    color='#512DA8'
                                    title="Submit"
                                    raised
                                    />
                            </View>
                            <View style={{margin:10}}>
                                <Button 
                                    onPress = {() => this.toggleModal()}
                                    color='gray'
                                    title="Cancel"
                                    raised
                                    />
                            </View>
                        </View>
                    </Modal>
                </>
            );
        }
        else {
            return(<View></View>);
        }
    }
}

function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Rating imageSize={20} readonly startingValue={item.rating} style={{marginRight: 'auto'}} />
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Card title='Comments' >
            <FlatList 
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
                />
        </Card>
    );
}

class Dishdetail extends Component {

    static navigationOptions = {
        title: 'Dish Details'
    };
    
    render(){
        const dishId = this.props.navigation.getParam('dishId','');
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.props.postFavorite(dishId)}
                    postComment={(rating, value, comment) => this.props.postComment(dishId, rating, value, comment)}
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    icon: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    }
});


export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);