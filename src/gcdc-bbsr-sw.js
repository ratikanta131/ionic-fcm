importScripts('ngsw-worker.js');
importScripts('firebase-messaging-sw.js');
var home_page = 'http://localhost:8888/';
self.addEventListener('sync', (event) => {
    if (event.tag === 'app-register') {
        event.waitUntil(registerData().then(() => {
            // showing notification
            try {
                if (Notification.permission === 'granted') {
                  self.registration.showNotification("Sync success", {
                      "body": "Success",
                      "icon": "./assets/icons/icon-512x512.png",
                      "vibrate": [200, 100, 200, 100, 200, 100, 400]
                    });
                } else {
                  console.log("Sync success");
                }
              } catch (err) {
                console.log("Sync success");
              }
        })
        .catch((err) => {
            try {
                if (Notification.permission === 'granted') {
                  self.registration.showNotification("Sync failure", {
                      "body": "Scheduled, Error : " + err,
                      "icon": "./assets/icons/icon-512x512.png",
                      "vibrate": [200, 100, 200, 100, 200, 100, 400]
                    });
                } else {
                  console.log("Could not sync, error : " + err);
                }
                throw err;
              } catch (err) {
                console.log("Could not sync, error : " + err);
                throw err;
              }
        })
        );
    }
})
function registerData(){
    return new Promise((resolve, reject) => {
        const obj = {
            name: 'Rohit',
            token: 'The test token from service worker'
        };
        fetch('http://localhost:8081/register',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        }).then(() => resolve())
        .catch(() => reject())
    });
}
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(clients.matchAll({
      type: 'window'
    }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url === home_page && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
      //   return clients.openWindow('/demo/');
        return clients.openWindow('/');
      }
    }));
  });