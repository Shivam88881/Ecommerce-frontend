import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HouseIcon from '@mui/icons-material/House';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PinDropIcon from '@mui/icons-material/PinDrop';
import CallIcon from '@mui/icons-material/Call';
import PublicIcon from '@mui/icons-material/Public';
import EmojiTransportationIcon from '@mui/icons-material/EmojiTransportation';
import BadgeIcon from '@mui/icons-material/Badge';
import MetaData from '../layout/MetaData';
import { useAlert } from 'react-alert';
import { Country, State } from 'country-state-city';
import '../styles/_shipping.scss';
import CheckoutStep from './CheckoutStep';
import { addAddress } from '../../redux/slice/cartSlice';
import {useNavigate} from 'react-router-dom';

function Shipping() {
    const { shippingInfo } = useSelector(state => state.cart);


    const alert = useAlert();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState(shippingInfo.name);
    const [address, setAddress] = useState(shippingInfo.address);
    const [city, setCity] = useState(shippingInfo.city);
    const [pincode, setPincode] = useState(shippingInfo.pincode);
    const [phoneNo, setPhoneNo] = useState(shippingInfo.PhoneNo || '');
    const [country, setCountry] = useState(shippingInfo.country);
    const [state, setState] = useState(shippingInfo.state);

    const shippingSubmit = async(e) => {
        e.preventDefault();

        if(phoneNo.length !== 10){
            alert.error("Phone no should be 10 digit");
            return;
        }

        const addressInfo = {
            name:name,
            address:address,
            city:city,
            pincode:pincode,
            phoneNo:phoneNo,
            country:country,
            state:state
        }

        await dispatch(addAddress(addressInfo));
        navigate('/confirm-order')
    }
    return (
        <>
        <MetaData title="Shipping Detail--Ecommerce" />
        <CheckoutStep activeStep={0}/>
            <div className='shipping-container'>
                <div className='shipping-box'>
                    <div className='shipping-heading'>Shipping Details</div>

                    <form
                        className='shipping-form'
                        encType='multipart/form-data'
                        onSubmit={shippingSubmit}
                    >
                        <div className='name'>
                            <BadgeIcon />
                            <input
                                type='text'
                                placeholder='Name'
                                required={true}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className='address'>
                            <HouseIcon />
                            <input
                                type='text'
                                placeholder='Address'
                                required={true}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        <div className='city'>
                            <LocationCityIcon />
                            <input
                                type='text'
                                placeholder='City'
                                required={true}
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>

                        <div className='pincode'>
                            <PinDropIcon />
                            <input
                                type="Number"
                                placeholder='Pincode'
                                required={true}
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                            />
                        </div>
                        <div className='phone-no'>
                            <CallIcon />
                            <input
                                type='Number'
                                placeholder='Phone Number'
                                required= {true}
                                value={phoneNo}
                                onChange={(e) => setPhoneNo(e.target.value)}
                            />
                        </div>

                        <div className='country'>
                            <PublicIcon />
                            <select
                                required={true}
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            >
                                <option value="">Country</option>
                                {
                                    Country.getAllCountries().map((cntry) => (
                                        <option key={cntry.isoCode} value={cntry.isoCode}>{cntry.name }</option>
                                    )) 
                                }
                            </select>
                        </div>
                        {
                            country && <div className='state'>
                            <EmojiTransportationIcon />
                            <select
                                required={true}
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            >
                                <option value="">State</option>
                                {
                                    State.getStatesOfCountry(country).map((st) => (
                                        <option key={st.isoCode} value={st.isoCode}>{st.name }</option>
                                    )) 
                                }
                            </select>
                        </div>
                        }

                        <button 
                        type='submit' 
                        className='submit-btn'
                        disabled={state ? false : true}
                        >Continue</button>

                    </form>
                </div>
            </div>
        </>
    )
}

export default Shipping
