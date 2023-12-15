//Chứa các function dùng chung cho cả project
import {ACCESS_TOKEN} from "../constants/index.js";

export const  checkToken =  ()=>localStorage.getItem(ACCESS_TOKEN)===null

export const  ROLE_ADMIN = "ROLE_AMDIN"

