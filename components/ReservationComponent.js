import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Switch, Button, TouchableOpacity, Alert, Picker } from 'react-native';
import { Icon } from 'react-native-elements'
//import DatePicker  from 'react-native-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';
import * as Animatable from 'react-native-animatable';
import * as Permissions from 'expo-permissions';
import * as Calendar from 'expo-calendar';
import { Notifications } from 'expo';

class Reservation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            guests: 1,
            smoking: false,
            date: new Date(),
            mode: '',
            showDate: false,
        }
    }

    componentDidMount(){
        if (Platform.OS === 'android') {
            Notifications.createChannelAndroidAsync('confusion', {
              name: 'confusion',
              priority: 'max',
              sound: true,
              vibrate: true,
            });
          }
    }
    
    static navigationOptions = {
        title: 'Reserve Table',
    };

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
        }
        return permission;
    }

    async presentLocalNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservation for '+ date + ' requested',
            ios: {
                sound: true
            },
            android: {
                channelId: "confusion",
                color: '#512DA8'
            }
        });
    }
    
    async obtainCalendarPermission() {
        let permission = await Permissions.getAsync(Permissions.CALENDAR);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.CALENDAR);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
        }
        return permission;
    }
    async obtainDefaultCalendarId() {
        let calendar = null;
        
        if (Platform.OS === 'ios') {
            calendar = await Calendar.getDefaultCalendarAsync();
        } else {
            const calendars = await Calendar.getCalendarsAsync();
            calendar = calendars.filter(calendar => calendar.accessLevel == 'owner')[0];
        }
        return calendar.id;
    }
    async addReservationToCalendar(date) {
        await this.obtainCalendarPermission();
        
        const event = Calendar.createEventAsync(await this.obtainDefaultCalendarId(), {
            title: 'Con Fusion Table Reservation',
            startDate: date,
            endDate: new Date(Date.parse(date.toISOString()) + 2*60*60*1000),
            timeZone: 'Asia/Hong_Kong',
            location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
        })
        .then(event => console.log('Event successfullly added to calendar: ' + event))
        .catch(err => console.log('Error: ' + err));
    }
    
    handleReservation() {
        console.log(JSON.stringify(this.state));
        this.resetForm();
    }
    resetForm(){
        this.setState({
            guests: 1,
            smoking: false,
            date: new Date(),
            mode: '',
            showDate: false
        });
    }
    
    render() {
        return(
            <ScrollView>
                <Animatable.View animation="zoomIn" duration={2000} delay={1000}>
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
                            onPress={() => this.setState({showDate: true, mode: 'date'})}
                            >
                            <Text>{Moment(this.state.date).format('DD-MMM-YYYY hh:mm A')}</Text>
                        </TouchableOpacity>
                        {this.state.showDate && (
                            <DateTimePicker
                                value={this.state.date}
                                mode={this.state.mode}
                                is24Hour={false}
                                display="default"
                                minimumDate= {new Date(2017,1,1)}
                                onChange={(event, selectedDate) => {
                                    if(selectedDate == undefined){
                                        this.setState({
                                            showDate: false
                                        });
                                    }else{
                                        this.setState({
                                            showDate: this.state.mode == 'time'? false : true,
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
                            onPress={() => Alert.alert(
                                'Your Reservation OK?',
                                `Number of Guests: ${this.state.guests} ${'\n'}Smoking?: ${this.state.smoking ? 'Yes' : 'No'} ${'\n'}Date and Time: ${this.state.date.toISOString()}`,
                                [
                                    { text: 'Cancel', onPress: () => this.resetForm(), style: 'cancel' },
                                    { text: 'OK', onPress: () => {
                                            this.presentLocalNotification(this.state.date);
                                            this.addReservationToCalendar(this.state.date);
                                            this.handleReservation();
                                        }
                                    }
                                ],
                                { cancelable: false }
                            )}
                            title="Reserve"
                            color="#512DA8"
                            accessibilityLabel="Learn more about this purple button"
                            />
                    </View>
                </Animatable.View>
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