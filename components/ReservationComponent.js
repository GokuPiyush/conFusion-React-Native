import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Switch, Button, TouchableOpacity, Picker } from 'react-native';
import { Icon } from 'react-native-elements'
//import DatePicker  from 'react-native-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';

class Reservation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            guests: 1,
            smoking: false,
            date: new Date(),
            show: false,
            mode: ''
        }
    }

    static navigationOptions = {
        title: 'Reserve Table',
    };

    handleReservation() {
        console.log(JSON.stringify({
            guests: this.state.guests,
            smoking: this.state.smoking,
            date: this.state.date
        }));
        this.setState({
            guests: 1,
            smoking: false,
            date: new Date(),
            show: false,
            mode: ''
        });
    }
    
    render() {
        return(
            <ScrollView>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Number of Guests</Text>
                    <Picker
                        style={styles.formItem}
                        selectedValue={this.state.guests}
                        onValueChange={(itemValue, itemIndex) => this.setState({guests: itemValue})}>
                        <Picker.Item label="1" value="1" />
                        <Picker.Item label="2" value="2" />
                        <Picker.Item label="3" value="3" />
                        <Picker.Item label="4" value="4" />
                        <Picker.Item label="5" value="5" />
                        <Picker.Item label="6" value="6" />
                    </Picker>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                    <Switch
                        style={styles.formItem}
                        value={this.state.smoking}
                        onTintColor='#512DA8'
                        onValueChange={(value) => this.setState({smoking: value})}>
                    </Switch>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Date and Time</Text>
                    <Icon type="font-awesome" name="calendar"/>
                    <TouchableOpacity
                        style={{
                            alignItems: "center",
                            backgroundColor: "#DDD",
                            padding: 10}}
                        onPress={() => this.setState({show: true, mode: 'date'})}
                        >
                        <Text>{Moment(this.state.date).format('DD-MMM-YYYY hh:mm A')}</Text>
                    </TouchableOpacity>
                    {this.state.show && (
                        <DateTimePicker
                            value={this.state.date}
                            mode={this.state.mode}
                            is24Hour={false}
                            display="default"
                            minimumDate= {new Date()}
                            onChange={(event, selectedDate) => {
                                if(selectedDate == undefined){
                                    this.setState({
                                        show: false
                                    });
                                }else{
                                    this.setState({
                                        show: this.state.mode == 'time'? false : true,
                                        mode: 'time',
                                        date: selectedDate
                                    });
                                }
                            }}
                        />
                    )}
                </View>
                <View style={styles.formRow}>
                    <Button
                        onPress={() => this.handleReservation()}
                        title="Reserve"
                        color="#512DA8"
                        accessibilityLabel="Learn more about this purple button"
                        />
                </View>
            </ScrollView>
        );
    }

};

const styles = StyleSheet.create({
    formRow: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
      margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    }
});


export default Reservation;