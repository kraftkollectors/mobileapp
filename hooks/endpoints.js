const API = "https://api.kraftkollectors.com";

export const END_POINT = {
  register: API + "/users/register",
  registerVerifyEmail: API + "/users/verifyemail",
  resendVerificationCode: API + "/users/otpagain",
  login: API + "/users/login",
  forgotPasswordSendEmail: API + "/users/forgot",
  forgotPasswordReset: API + "/users/reset",
  contactSupport: API + "/users/contact",
  becomeArtisan: API + "/users/artisan",
  uploadCertificate: API + "/users/certificate",
  uploadEducation: API + "/users/education",
  makeFavourite: `${API}/users/savead`,
  services: API + "/users/ads",
  artisan: API + "/users/artisan",
  reportService: API + "/users/reportad",
  rateService: API + "/users/rateads",
  uploadSingleFile: API + "/users/geturl",
  uploadManyFiles: API + "/users/geturls",
  searchArtisan: (q, pgn) => `${API}/admin/users/artisans?q=${q}&page=${pgn}`, ///PENDING CORRECTION
  searchServices: (
    q,
    pgn,
    category,
    subCategory,
    sort,
    minPrice,
    maxPrice,
    longitude,
    latitude,
    radius
  ) =>
    `${API}/users/ads?q=${q}&page=${pgn}&category=${category}&subCategory=${subCategory}&sort=${sort}&minPrice=${minPrice}&maxPrice=${maxPrice}&longitude=${longitude}&latitude=${latitude}&radius=${radius}`,
  updateUserProfile: (id) => `${API}/users/dashboard/profile/${id}`,
  updateUserPassword: (id) => `${API}/users/dashboard/password/${id}`,
  getUserCertificates: (id) => `${API}/users/certificate/user/${id}`,
  getUserEducations: (id) => `${API}/users/education/user/${id}`,
  editCertificate: (id) => `${API}/users/certificate/${id}`,
  editEducation: (id) => `${API}/users/education/${id}`,
  getUser: (id) => `${API}/users/dashboard/${id}`,
  getArtisan: (id) => `${API}/users/artisan/${id}`,
  updateArtisanProfile: (id) => `${API}/users/artisan/${id}`,
  getArtisanServices: (id) => `${API}/users/myads/${id}`,
  getSingleArtisanService: (id) => `${API}/users/ads/${id}`,
  checkFavourite: (user, service) =>
    `${API}/users/checksavead?userid=${user}&serviceid=${service}`,
  deleteFavourite: (userId, serviceId) =>
    `${API}/users/savead?userid=${userId}&serviceid=${serviceId}`,
  myFavouriteServices: (id) => `${API}/users/getsavead/${id}`,
  getServiceRatings: (id, pgn) =>
    `${API}/users/rateads/${id}?page=${!pgn || pgn === 0 ? 1 : pgn}`,
  getChatHeads: (id) => `${API}/users/chatheads/${id}`,
  getChats: (userId, guestId, lastTime) =>
    `${API}/users/chat?userid=${userId}&receiverid=${guestId}${
      lastTime ? `&time=${lastTime}` : ""
    }`,
  updateLastSeen: (userId) => `${API}/users/lastseen/${userId}`,
  paidAds: `${API}/admin/paidads`,
  getSavedSearch: API + "/users/searchads",
  userReviews: (userId) => API + "/users/userreviews/" + userId,
  userReviewsCount: (userId) => API + "/users/userreviewscount/" + userId,
};

const STATES_AND_CITIES_API = "https://abundiko-api.vercel.app/api";
export const STATE_END_POINT = {
  nigerianStates: `${STATES_AND_CITIES_API}/nigerian-states`,
};

SOCKET_API = "wss://backends-865y.onrender.com";

export const SOCKET_EVENTS = {
  on: {
    connect: "connect",
    disconnect: "disconnect",
    error: "error",
    joined_room: "userJoined",
    logged_in: "userLogged",
    started_typing: "typingStart",
    stopped_typing: "typingStop",
    new_message: "message",
    sent_message: "senderMessage",
    received_message: "receiverMessage",
  },
  emit: {
    join_room: "joinRoom",
    login_room: "loginRoom",
    start_typing: "onTypingStart",
    stop_typing: "onTypingStop",
    send_message: "chatMessage",
    mark_seen: "markSeen",
  },
};
export default SOCKET_API;
