/**
 * PWA FinDeFes
 * update 04/2022
 * By Sergio Sam 
 */

export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.accessToken) {
    return { Authorization: 'Bearer ' + user.accessToken }; // for Spring Boot back-end
  } else {
    return {};
  }
}