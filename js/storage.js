const K={settings:"mithra_v2_settings",chat:"mithra_v2_chat",saved:"mithra_v2_saved",progress:"mithra_v2_progress"};
function get(k,f=[]){try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}function set(k,v){localStorage.setItem(k,JSON.stringify(v))}
function settings(){return get(K.settings,{theme:"system",saveChat:true,typing:true})}function chats(){return get(K.chat,[])}function saved(){return get(K.saved,[])}function progress(){return get(K.progress,[])}
function clearData(){Object.values(K).forEach(k=>localStorage.removeItem(k))}