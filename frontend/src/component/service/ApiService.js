import axios from "axios"
import { jwtDecode } from 'jwt-decode';

export default class ApiService{
    static BASE_URL = "http://localhost:8080";

    static getUsername(){
        const token = localStorage.getItem("token");
        return jwtDecode(token).sub;
    }

    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }

    static isAdmin(){
        const role = localStorage.getItem("role")
        return role === "ADMIN";
    }
    static isUser(){
        const role = localStorage.getItem("role")
        return role === "USER";
    }

    static login = async (data)=>{
        const response = await axios.post(`${this.BASE_URL}/auth/login`,data)
        return response.data;
    }
    static register = async (data)=>{
        const response = await axios.post(`${this.BASE_URL}/auth/register`,data)
        return response.data;
    }

    static changePassword = async (currentPassword, newPassword)=>{
        const response = await axios.post(`${this.BASE_URL}/auth/change-password`,{
            currentPassword,
            newPassword
        },{
            headers: this.getHeader()
        })
        return response.data;
    }

    static updateCustomerInfo = async (data)=>{
        const response = await axios.post(`${this.BASE_URL}/customer/update-customer-infor`,data,{
            headers: this.getHeader()
        })
        return response.data;
    }

    static getCustomerInfor = async ()=>{
        const response = await axios.get(`${this.BASE_URL}/customer/customer-infor`,{
            headers: this.getHeader()
        })
        return response.data;
    }

    static getAllRoom = async ()=>{
        const response = await axios.get(`${this.BASE_URL}/room/all`)
        return response.data;
    }
    static getRoomById = async (id)=>{
        const response = await axios.get(`${this.BASE_URL}/room/room-by-id/${id}`)
        return response.data;
    }

    static createRoom = async (data) => {
        const response = await axios.post(`${this.BASE_URL}/room/create`, data, {
          headers: this.getHeader()
        });
        return response.data;
    }
    
    static updateRoom = async (id, data) => {
        const response = await axios.put(`${this.BASE_URL}/room/update/${id}`, data, {
          headers: this.getHeader()
        });
        return response.data;
    }

    static createBooking = async (data) => {
        const response = await axios.post(`${this.BASE_URL}/booking/create`,data,{
            headers: this.getHeader()
        })
        return response.data;
    }

    static getBookingByCustomer = async () => {
        const response = await axios.get(`${this.BASE_URL}/booking/get-by-customer`,{
            headers: this.getHeader()
        })
        return response.data;
    }

    static getAllBooking = async () => {
        const response = await axios.get(`${this.BASE_URL}/booking/get-all`,{
            headers: this.getHeader()
        })
        return response.data;
    }

    static getRoomEmty = async (data)=>{
        const response = await axios.post(`${this.BASE_URL}/booking/vacancy`,data)
        return response.data;
    }

    static payBooking = async (bookingID) => {
        const response = await axios.get(`${this.BASE_URL}/booking/pay-ment/${bookingID}`,{
            headers: this.getHeader() 
        });
        return response.data;
    }    
    
    static checkInBooking = async (bookingID) => {
        const response = await axios.get(`${this.BASE_URL}/booking/check-in/${bookingID}`,{
            headers: this.getHeader() 
        });
        return response.data;
    }

    static cleanedBooking = async (bookingID) => {
        const response = await axios.get(`${this.BASE_URL}/booking/cleaned/${bookingID}`,{
            headers: this.getHeader() 
        });
        return response.data;
    }

    static payCofirmBooking = async (bookingID) => {
        const response = await axios.get(`${this.BASE_URL}/booking/pay-ment-confirm/${bookingID}`,{
            headers: this.getHeader() 
        });
        return response.data;
    } 

    static getBookingByYear = async (year) => {
        const response = await axios.get(`${this.BASE_URL}/booking/get-by-year/${year}`,{
            headers: this.getHeader() 
        });
        return response.data;
    } 

    static feedbackBooking = async (booking, rating, feedback) => {
        const response = await axios.post(`${this.BASE_URL}/feed-back/create`, {
            rate: rating,
            feedback: feedback,
            bookingDTO: booking
        }, {
            headers: this.getHeader() 
        });
        return response.data;
    }

    static getFeedbackByBooking = async (bookingID) => {
        const response = await axios.get(`${this.BASE_URL}/feed-back/get-by-booking/${bookingID}`,{
            headers: this.getHeader()
        })
        return response.data;
    } 
    
    static getFeedbackByRoom = async (roomID) => {
        const response = await axios.get(`${this.BASE_URL}/feed-back/get-by-room/${roomID}`)
        return response.data;
    } 
}