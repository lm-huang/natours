/* eslint-disable */

import { showAlert } from './alert.js';
// const axios = require('axios/dist/browser/axios.cjs');
// import axios from 'axios';

const login = async (email, password) => {
  try {
    const res = await axios({
      // withCredentials:true,
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'logged in successfully');
      console.log("login.js:")
      console.log(res.data);
      document.cookie = 'jwt='+res.data.token
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

const loginForm = document.querySelector('.form--login');

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    login(email, password);
  });
}
