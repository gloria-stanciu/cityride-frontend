import React from 'react';

import '../css/CreateAccount.css';
import Button from './Button'
import {useHistory} from 'react-router-dom';

function CreateAccount(){
    const history = useHistory();
    return (
      <div className='parentDiv d-flex flex-column justify-content-between text-center'>
        <button className="btn" onClick={()=>{
            history.push('/')
        }}>
            <img src='/images/app_name.png' alt="app name" className='logo mt-4'/>  
        </button>
            <div className="descriptionTitle">Create account</div>
          <div className="container col-10 col-lg-6 col-md-7">
            <div className='row'>
              <div className="col col-6">
                  <label className='form-check-label col-12 my-1'>First name</label>
                  <input type="text" className="form-control form-control-responsive form-control-lg" placeholder="Anne"/>
              </div>
              <div className="col col-6">
                  <label className='form-check-label col-12 my-1'>Last name</label>
                  <input type="text" className="form-control form-control-responsive form-control-lg" placeholder="Smith"/>
              </div>
            </div>
              <div className="col-12">
                  <label className='form-check-label col-12 my-1'>Phone number</label>
                  <input type="text" className="form-control form-control-responsive form-control-lg" placeholder="+40 742 426 326"/>
              </div>
              <div className="col-12">
                  <label className='form-check-label col-12 my-1'>Password</label>
                  <input type="text" className="form-control form-control-responsive form-control-lg" placeholder="************"/>
              </div>
              <div className="col-12">
              <label className='form-check-label col-12 my-1'>Re-type password</label>
                  <input type="text" className="form-control form-control-responsive form-control-lg" placeholder="************"/>
              </div>
        </div>
        <div>
            <Button className="btn btn-responsive btn-primary purple col-8 col-sm-6 col-md-4 col-lg-3" name='Create account'></Button>
            <br/>
            <Button className="btn btn-responsive btn-light white col-8 col-sm-6 col-md-4 col-lg-3" name='Log in'></Button>
        </div>
  </div>
      );
}

export default CreateAccount;