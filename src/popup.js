import React from 'react'
import { UseStateValue } from './StateProvider';
import './popup.css';
function popup(props) {
    const [{ user }, dispatch] = UseStateValue();
    return (props.trigger) ? (
        <div className='popup'>
        <div className='popup-inner'>    <form action="">

            <fieldset>
                <div class="grid-35">
                    <label for="avatar">Your Photo</label>
                </div>
                <div class="grid-65">
                    <span class="photo" title="Upload your Avatar!"></span>
                    <input type="file" class="btn" />
                </div>
            </fieldset>
            <fieldset>
                <div class="grid-35">
                    <label for="fname"> Name</label>
                </div>
                <div class="grid-65">
                        <input type="text" id="fname" tabindex="1" value={user.name
                        
                        } />
                </div>
            </fieldset>
               <fieldset>
                <div class="grid-35">
                    <label for="description">About you</label>
                </div>
                <div class="grid-65">
                    <textarea name="" id="" cols="30" rows="auto" tabindex="3"></textarea>
                </div>
            </fieldset>
            <fieldset>
                <div class="grid-35">
                    <label for="location">Location</label>
                </div>
                <div class="grid-65">
                    <input type="text" id="location" tabindex="4" />
                </div>
            </fieldset>
            
            <fieldset>
                <div class="grid-35">
                    <label for="email">Email Address</label>
                </div>
                <div class="grid-65">
                        <input type="email" id="email" tabindex="6" value={ user.email}/>
                </div>
            </fieldset>
            
                <input type="submit" class="Btn" value="Save Changes" />
          

        </form>

                <button className='close-btn' onClick={() => props.setTrigger(false)} >❌</button>

            </div>
        </div>
    ) : "";
}

export default popup