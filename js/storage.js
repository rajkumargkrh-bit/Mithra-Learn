const MITHRA_KEYS={settings:"mithra_settings",chat:"mithra_chat_history",saved:"mithra_saved_lessons",recent:"mithra_recent_topics"};
function getData(key,fallback){try{const v=localStorage.getItem(key);return v===null?fallback:JSON.parse(v)}catch{return fallback}}
function setData(key,value){localStorage.setItem(key,JSON.stringify(value))}
function removeData(key){localStorage.removeItem(key)}
function getSettings(){return getData(MITHRA_KEYS.settings,{theme:"system",saveChat:true,typing:true})}
function saveSettings(s){setData(MITHRA_KEYS.settings,s)}
function getChat(){return getData(MITHRA_KEYS.chat,[])}
function saveChat(messages){setData(MITHRA_KEYS.chat,messages)}
function clearAllData(){Object.values(MITHRA_KEYS).forEach(removeData)}