import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { Button, Row, Col } from 'antd';
import { addAction } from '../action';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

const mapStyles = {
  width: '100%',
  height: '100%'
};

class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLocation: {},
            address: '',
            currentTimeZone: {},
            currentLocalTime: ''
        };
    }

    handleChange = address => {
        this.setState({ address });
    };
     
    handleSelect = address => {
        geocodeByAddress(address)
          .then(results => getLatLng(results[0]))
          .then(latLng => {
                this.setState({address});
                this.setState({currentLocation: latLng});
                const location = {
                    key: uuidv4(),
                    name: address,
                    location: latLng,
                    visitedDate: new Date().toString(),
                }
                this.props.sendAction(addAction("add", location));
                const url = "https://maps.googleapis.com/maps/api/timezone/json?location=" + latLng.lat + "," + latLng.lng + "&timestamp=1331161200&key=" + "Your Google Map API key Here";
                fetch(url, {method: 'GET'})
                    .then((res) => res.json())
                    .then((data) => {
                        this.setState({currentTimeZone: data});
                        const localTime = new Date().toLocaleString("en-US", {timeZone: data.timeZoneId});
                        this.setState({currentLocalTime: localTime});
                    });
            })
          .catch(error => console.error('Error', error));
    };

    getCurrentLocation = ()=>{
        if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
              const coords = pos.coords;
              const location = {
                key: uuidv4(),
                name: "My address",
                location: {
                    lat: coords.latitude,
                    lng: coords.longitude
                },
                visitedDate: new Date().toString(),
              };
              this.setState({
                currentLocation: {
                  lat: coords.latitude,
                  lng: coords.longitude
                }
              });
              this.props.sendAction(addAction("add", location));
            });
        }
    }
    
    render() {
        return (
            <div>
                <Row>
                    <Col style={{padding: "1rem"}} span={6} offset={1}>
                        <h3><Link to="/history">Visited History</Link></h3>
                    </Col>
                </Row>
                <Row>
                    <Col span={8} offset={8}>
                        <PlacesAutocomplete
                            value={this.state.address}
                            onChange={this.handleChange}
                            onSelect={this.handleSelect}
                        >
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div>
                                <input
                                {...getInputProps({
                                    placeholder: 'Search Places ...',
                                    className: 'location-search-input',
                                })}
                                />
                                <div className="autocomplete-dropdown-container">
                                {loading && <div>Loading...</div>}
                                {suggestions.map(suggestion => {
                                    const className = suggestion.active
                                    ? 'suggestion-item--active'
                                    : 'suggestion-item';
                                    // inline style for demonstration purpose
                                    const style = suggestion.active
                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                    return (
                                    <div
                                        {...getSuggestionItemProps(suggestion, {
                                        className,
                                        style,
                                        })}
                                    >
                                        <span>{suggestion.description}</span>
                                    </div>
                                    );
                                })}
                                </div>
                            </div>
                            )}
                        </PlacesAutocomplete>
                        {this.state.currentTimeZone?.timeZoneName} {this.state.currentLocalTime}
                    </Col>
                    <Col span={4} offset={4}>
                        <Button type="primary" onClick={this.getCurrentLocation}>Find My Address</Button>
                    </Col>
                </Row>
                <Row>
                    <Map
                        google={this.props.google}
                        zoom={14}
                        style={mapStyles}
                        initialCenter={
                            {
                                lat: 43.8906162,
                                lng: -79.2961266
                            }
                        }
                        center={this.state.currentLocation}
                    >
                        {
                            this.props.locations.map(item => {
                                return (
                                    <Marker key={item.name} name={item.name} position={item.location} onClick={this.onMarkerClick}/>
                                )
                            })
                        }
                    </Map>
                </Row>
                
                
            </div>
        );
    }
}

const mapDispatchToPropsOut = dispatch => {
    return {
      sendAction: (action) => {
        dispatch(action);
      }
    }
  }
  
  const mapDispatchToPropsIn = state => {
    return state;
  }
  

export default GoogleApiWrapper({
    apiKey: "Your Google Map API key Here"
})(connect(mapDispatchToPropsIn, mapDispatchToPropsOut)(MapContainer));