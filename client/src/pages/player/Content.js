import React, {Component} from 'react';
import LoadingIndicator from "../../common/LoadingIndicator";
import {notification} from "antd";
import {getPlayerStats} from "./API";

export default class Content extends Component {

    constructor(props) {
        super(props);

        this.state = {
            completed: false,
            playerData: null
        };
    }

    componentDidMount() {
        let statsRequest = {
            firstName: this.props.selectedPlayer.first_name,
            lastName: this.props.selectedPlayer.last_name,
            year: this.props.selectedPlayer.year
        };
        console.log(statsRequest);

        getPlayerStats(statsRequest)
        .then(result => {
            console.log(result);
            this.setState({
                completed: true,
                playerData: result
            }, () => {
                this.props.setPlayerData(result);
            });
        })
        .catch(error => {
            notification.error({
                message: 'Athletic Storm',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
            this.props.onClose();
        })
    }

    render() {

        if (this.state.completed) {

            if(this.state.playerData === null){
                return (
                    <div style={{"text-align": "center"}}>
                        <h1>Couldn't load data for {this.props.selectedPlayer.first_name} {this.props.selectedPlayer.last_name}.</h1>
                    </div>
                );
            }

            return (
                <div style={{"textAlign": "center"}}>
                    <div>
                        <h2> Weight: {this.state.playerData.player.weight} pounds</h2>
                        <h2> Height: {this.state.playerData.player.height} inches</h2>
                        <h2> Team: {this.state.playerData.player.team}</h2>
                        <h2> Position: {this.state.playerData.player.position}</h2>
                    </div>
                    {this.state.playerData.hasAdvancedPlayer &&
                    (<div>
                        <h2> Overall: {this.state.playerData.advancedPlayer.usage.overall}</h2>
                        <h2> Pass: {this.state.playerData.advancedPlayer.usage.pass}</h2>
                        <h2> Rush: {this.state.playerData.advancedPlayer.usage.rush}</h2>
                        <h2> First Down: {this.state.playerData.advancedPlayer.usage.firstDown}</h2>
                        <h2> Second Down: {this.state.playerData.advancedPlayer.usage.secondDown}</h2>
                        <h2> Third Down: {this.state.playerData.advancedPlayer.usage.thirdDown}</h2>
                        {/*<h2> Start Ranking: {this.state.personData.advancedPlayer.startRanking}</h2>*/}
                        {/*<h2> Current Ranking: {this.state.personData.advancedPlayer.currentRanking}</h2>*/}
                    </div>)
                    }
                </div>
            );
        } else {
            return (
                <div>
                    <LoadingIndicator/>
                    <br/>
                </div>
            );

        }
    }
}