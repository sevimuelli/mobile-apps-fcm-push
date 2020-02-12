module.exports = {
  createPayload: function createPayload(req) {
    let payload = {
      android: {},
      data: {}
    };
    let updateRateLimits = true;

    if(req.body.data){

      // Handle the web actions by changing them into a format the app can handle
      // https://www.home-assistant.io/integrations/html5/#actions
      if(req.body.data.actions) {
        for (let i = 0; i < req.body.data.actions.length; i++) {
          const action = req.body.data.actions[i];
          if(action.action){
            payload.data["action_"+(i+1)+"_key"] = action.action
          }
          if(action.title) {
            payload.data["action_"+(i+1)+"_title"] = action.title
          }
          if(action.uri){
            payload.data["action_"+(i+1)+"_uri"] = action.uri
          }
        }
      }

      // Allow setting of ttl
      // https://firebase.google.com/docs/reference/admin/node/admin.messaging.AndroidConfig.html#optional-ttl
      if(req.body.data.ttl){
        payload.android.ttl = req.body.data.ttl
      }

      // https://firebase.google.com/docs/reference/admin/node/admin.messaging.AndroidConfig.html#optional-priority
      if(req.body.data.priority){
        payload.android.priority = req.body.data.priority
      }

      // https://firebase.google.com/docs/reference/admin/node/admin.messaging.AndroidNotification.html#optional-tag
      // https://firebase.google.com/docs/reference/admin/node/admin.messaging.AndroidNotification.html#optional-sticky
      for (const key of ['image', 'tag', 'sticky', 'color', 'clickAction']) {
        if(req.body.data[key]){
          payload.data[key] = String(req.body.data[key])
        }
      }
    }

    // Always put message, title, and image in data so that the application can handle creating
    // the notifications.  This allows us to safely create actionable/imaged notifications.
    if(req.body.message) {
      payload.data.message = req.body.message
    }
    if(req.body.title) {
      payload.data.title = req.body.title
    }

    return { updateRateLimits: updateRateLimits, payload: payload };
  }
}