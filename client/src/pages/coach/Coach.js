import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import axios from 'axios';
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ReactMinimalPieChart from "react-minimal-pie-chart";
import LoadingIndicator from "../../common/LoadingIndicator";

class Coach extends Component {

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            name: "",
            last_name: "",
            record: null
        };
    }

    componentDidMount() {
        // Get coach name from url
        axios.get('http://localhost:8080/api/coaches/record/byName/' + this.props.match.params.coachName)
        .then(result => {
            console.log(result.data);
            this.setState({
                loading: false,
                name: result.data.name,
                record: result.data
            });
        })
    }

    perc2color(perc) {
        var r, g, b = 0;
        if(perc < 50) {
            r = 255;
            g = Math.round(5.1 * perc);
        }
        else {
            g = 255;
            r = Math.round(510 - 5.10 * perc);
        }
        var h = r * 0x10000 + g * 0x100 + b;
        return '#' + ('000000' + h.toString(16)).slice(-6);
    }

    render() {
        if (!this.state.loading) {

            // Name successfully found
            return (
                <div>
                    <div style={{"text-align": "center"}}>
                        <h1 style={{marginTop: 14, fontSize: 80}}>{this.state.name} (<span style={{color: this.state.record.rating === -1 ? "#000000" : this.perc2color(this.state.record.rating)}}>{this.state.record.rating === -1 ? "--" : this.state.record.rating.toFixed(2)}</span>)</h1>
                        <h2>All time record: {this.state.record.wins}-{this.state.record.losses}</h2>
                    </div>
                    <br/>
                    {this.state.record.terms.map(term => (
                        <div>
                            <Paper style={{paddingRight: '10px', marginBottom: '15px'}}>
                                <Grid container align="center" justify="left" spacing={3}>
                                    <Grid item xs={2}>
                                        <Link
                                            to={{
                                                pathname: "/school/" + term.team.school,
                                                state: {
                                                    teamId: term.team.id
                                                }
                                            }}
                                            style={{"text-align": "center"}}
                                        >
                                            <img style={{ marginLeft: 10 }} src={term.team.logos[0]} height="100" width="100" alt={term.team.school}/>
                                        </Link>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <span style={{ marginLeft: 30, color: term.team.color}}>
                                            {term.team.school} ({term.start_year}{term.end_year !== -1 && term.end_year !== term.start_year ? "-" + term.end_year : ""})
                                        </span>
                                    </Grid>
                                    <Grid item xs={7}>
                                        <Grid container align="center" justify="left" spacing={3}>
                                            {term.seasons.map(season => (
                                                <Grid item xs={3}>
                                                    <Paper>
                                                        <ReactMinimalPieChart
                                                            animate={true}
                                                            animationDuration={500}
                                                            animationEasing="ease-out"
                                                            cx={50}
                                                            cy={50}
                                                            data={[
                                                                {
                                                                    color: '#009900',
                                                                    title: 'Wins',
                                                                    value: season.wins
                                                                },
                                                                {
                                                                    color: '#CC0000',
                                                                    title: 'Losses',
                                                                    value: season.losses
                                                                }
                                                            ]}
                                                            label={false}
                                                            radius={25}
                                                            viewBoxSize={[
                                                                30,
                                                                30
                                                            ]}
                                                        />
                                                        <Typography>{season.year}: {season.wins}-{season.losses}</Typography>
                                                    </Paper>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                            <br/>
                        </div>
                    ))}
                </div>
            )
        } else {
            // Error: name not found
            return (
                <LoadingIndicator />
            )
        }
    }
}

export default withRouter(Coach);