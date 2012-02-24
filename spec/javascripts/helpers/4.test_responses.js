window.TestResponses = {
  chat: {
    open: [
      200,
      {'Content-Type': 'application/json'},
      '{"chat":{"_id":"1","created_at":"2012-01-04T16:19:44-05:00","is_archived":false,"is_open":true,"updated_at":"2012-01-21T17:07:44-05:00"},"page":{"_id":"2","chat_id":"1","created_at":"2012-01-26T14:37:40-05:00","is_open":true,"updated_at":"2012-01-26T14:37:40-05:00","messages":[],"next_page":"/chats/1/pages/3.json","prev_page":"/chats/1/pages/1.json"}}'
      ],
    closed: [
      200,
      {'Content-Type': 'application/json'},
      '{"chat":{"_id":"1","created_at":"2012-01-04T16:19:44-05:00","is_archived":false,"is_open":false,"updated_at":"2012-01-21T17:07:44-05:00"},"page":null}'
      ],
    archived: [
      200,
      {'Content-Type': 'application/json'},
      '{"chat":{"_id":"1","created_at":"2012-01-04T16:19:44-05:00","is_archived":true,"is_open":false,"updated_at":"2012-01-21T17:07:44-05:00"},"page":{"_id":"2","chat_id":"1","created_at":"2012-01-26T14:37:40-05:00","is_open":true,"updated_at":"2012-01-26T14:37:40-05:00","messages":[],"next_page":"/chats/1/pages/3.json","prev_page":"/chats/1/pages/1.json"}}'
      ],
    moderator: [
      200,
      {'Content-Type': 'application/json'},
      '{"chat":{"_id":"1","created_at":"2012-01-05T20:42:39+00:00","is_archived":false,"is_open":true,"updated_at":"2012-01-22T18:12:05+00:00"},"limit":100,"messages":[{"_id":"4f1de2399e0d520008000001","created_at":"2012-01-23T22:42:01+00:00","display_name":"Test","is_moderated":false,"is_public":false,"text":"test","updated_at":"2012-01-23T22:42:01+00:00","user":null},{"_id":"4f33e37c7c094f0007000001","created_at":"2012-02-09T15:17:16+00:00","display_name":"Test","is_moderated":false,"is_public":false,"text":"test 2","updated_at":"2012-02-09T15:17:16+00:00","user":null}]}'
      ],
    error: [
      500,
      {'Content-Type': 'application/json'},
      ''
      ]
  },
  page: {
    open: [
      200,
      {'Content-Type': 'application/json'},
      '{"chat":{"_id":"1","created_at":"2012-01-05T20:42:39+00:00","is_archived":false,"is_open":true,"updated_at":"2012-01-22T18:12:05+00:00"},"page":{"_id":"2","chat_id":"1","created_at":"2012-01-22T02:27:06+00:00","is_open":true,"updated_at":"2012-01-22T02:27:06+00:00","messages":[{"_id":"4f1b73fa340942000100001c","created_at":"2012-01-22T02:27:06+00:00","display_name":"Dan Drinkard","is_moderated":true,"is_public":true,"text":"the first message","updated_at":"2012-01-22T02:28:06+00:00","user":{"_id":"4f05ff1cef2c980001000006","affiliation":"Sunlight Foundation","created_at":"2012-01-05T19:50:52+00:00","email":"ddrinkard@sunlightfoundation.com","name":"Dan Drinkard","updated_at":"2012-01-22T18:06:03+00:00","url":"http://sunlightfoundation.com/people/ddrinkard/","small_avatar_url":"/static/user/avatar/4f05ff1cef2c980001000006/small_100x100_ddrinkard.jpg"}},{"_id":"4f1b73ff340942000100001e","created_at":"2012-01-22T02:27:11+00:00","display_name":"Dan Drinkard","is_moderated":true,"is_public":true,"text":"the second message","updated_at":"2012-01-22T02:27:11+00:00","user":{"_id":"4f05ff1cef2c980001000006","affiliation":"Sunlight Foundation","created_at":"2012-01-05T19:50:52+00:00","email":"ddrinkard@sunlightfoundation.com","name":"Dan Drinkard","updated_at":"2012-01-22T18:06:03+00:00","url":"http://sunlightfoundation.com/people/ddrinkard/","small_avatar_url":"/static/user/avatar/4f05ff1cef2c980001000006/small_100x100_ddrinkard.jpg"}},{"_id":"4f1b7409340942000100001f","created_at":"2012-01-22T02:27:21+00:00","display_name":"Dan Drinkard","is_moderated":true,"is_public":true,"text":"the third message","updated_at":"2012-01-22T02:45:21+00:00","user":{"_id":"4f05ff1cef2c980001000006","affiliation":"Sunlight Foundation","created_at":"2012-01-05T19:50:52+00:00","email":"ddrinkard@sunlightfoundation.com","name":"Dan Drinkard","updated_at":"2012-01-22T18:06:03+00:00","url":"http://sunlightfoundation.com/people/ddrinkard/","small_avatar_url":"/static/user/avatar/4f05ff1cef2c980001000006/small_100x100_ddrinkard.jpg"}}],"next_page":null,"prev_page":"/chats/1/pages/1.json"}}'
      ],
    full: [
      200,
      {'Content-Type': 'application/json'},
      '{"chat":{"_id":"1","created_at":"2012-01-05T20:42:39+00:00","is_archived":false,"is_open":true,"updated_at":"2012-01-22T18:12:05+00:00"},"page":{"_id":"2","chat_id":"1","created_at":"2012-01-22T02:27:06+00:00","is_open":false,"updated_at":"2012-01-22T02:28:06+00:00","messages":[{"_id":"4f1b73fa340942000100001c","created_at":"2012-01-22T02:27:06+00:00","display_name":"Dan Drinkard","is_moderated":true,"is_public":true,"text":"the first message","updated_at":"2012-01-22T02:28:06+00:00","user":{"_id":"4f05ff1cef2c980001000006","affiliation":"Sunlight Foundation","created_at":"2012-01-05T19:50:52+00:00","email":"ddrinkard@sunlightfoundation.com","name":"Dan Drinkard","updated_at":"2012-01-22T18:06:03+00:00","url":"http://sunlightfoundation.com/people/ddrinkard/","small_avatar_url":"/static/user/avatar/4f05ff1cef2c980001000006/small_100x100_ddrinkard.jpg"}},{"_id":"4f1b73ff340942000100001e","created_at":"2012-01-22T02:27:11+00:00","display_name":"Dan Drinkard","is_moderated":true,"is_public":true,"text":"the second message","updated_at":"2012-01-22T02:27:11+00:00","user":{"_id":"4f05ff1cef2c980001000006","affiliation":"Sunlight Foundation","created_at":"2012-01-05T19:50:52+00:00","email":"ddrinkard@sunlightfoundation.com","name":"Dan Drinkard","updated_at":"2012-01-22T18:06:03+00:00","url":"http://sunlightfoundation.com/people/ddrinkard/","small_avatar_url":"/static/user/avatar/4f05ff1cef2c980001000006/small_100x100_ddrinkard.jpg"}},{"_id":"4f1b7409340942000100001f","created_at":"2012-01-22T02:27:21+00:00","display_name":"Dan Drinkard","is_moderated":true,"is_public":true,"text":"the third message","updated_at":"2012-01-22T02:45:21+00:00","user":{"_id":"4f05ff1cef2c980001000006","affiliation":"Sunlight Foundation","created_at":"2012-01-05T19:50:52+00:00","email":"ddrinkard@sunlightfoundation.com","name":"Dan Drinkard","updated_at":"2012-01-22T18:06:03+00:00","url":"http://sunlightfoundation.com/people/ddrinkard/","small_avatar_url":"/static/user/avatar/4f05ff1cef2c980001000006/small_100x100_ddrinkard.jpg"}}],"next_page":"/chats/1/pages/3.json","prev_page":"/chats/1/pages/1.json"}}'
      ],
    prev: [
      200,
      {'Content-Type': 'application/json'},
      '{"chat":{"_id":"1","created_at":"2012-01-05T20:42:39+00:00","is_archived":false,"is_open":true,"updated_at":"2012-01-22T18:12:05+00:00"},"page":{"_id":"1","chat_id":"1","created_at":"2012-01-22T02:26:06+00:00","is_open":true,"updated_at":"2012-01-22T02:26:06+00:00","messages":[],"next_page":"/chats/1/pages/2.json","prev_page":null}}'
      ],
    closed: [
      200,
      {'Content-Type': 'application/json'},
      '{"chat":{"_id":"1","created_at":"2012-01-05T20:42:39+00:00","is_archived":false,"is_open":false,"updated_at":"2012-01-22T18:12:05+00:00"},"page":{"_id":"2","chat_id":"1","created_at":"2012-01-22T02:27:06+00:00","is_open":false,"updated_at":"2012-01-22T02:27:06+00:00","messages":[{"_id":"4f1b73fa340942000100001c","created_at":"2012-01-22T02:27:06+00:00","display_name":"Dan Drinkard","is_moderated":true,"is_public":true,"text":"the first message","updated_at":"2012-01-22T02:28:06+00:00","user":{"_id":"4f05ff1cef2c980001000006","affiliation":"Sunlight Foundation","created_at":"2012-01-05T19:50:52+00:00","email":"ddrinkard@sunlightfoundation.com","name":"Dan Drinkard","updated_at":"2012-01-22T18:06:03+00:00","url":"http://sunlightfoundation.com/people/ddrinkard/","small_avatar_url":"/static/user/avatar/4f05ff1cef2c980001000006/small_100x100_ddrinkard.jpg"}},{"_id":"4f1b73ff340942000100001e","created_at":"2012-01-22T02:27:11+00:00","display_name":"Dan Drinkard","is_moderated":true,"is_public":true,"text":"the second message","updated_at":"2012-01-22T02:27:11+00:00","user":{"_id":"4f05ff1cef2c980001000006","affiliation":"Sunlight Foundation","created_at":"2012-01-05T19:50:52+00:00","email":"ddrinkard@sunlightfoundation.com","name":"Dan Drinkard","updated_at":"2012-01-22T18:06:03+00:00","url":"http://sunlightfoundation.com/people/ddrinkard/","small_avatar_url":"/static/user/avatar/4f05ff1cef2c980001000006/small_100x100_ddrinkard.jpg"}},{"_id":"4f1b7409340942000100001f","created_at":"2012-01-22T02:27:21+00:00","display_name":"Dan Drinkard","is_moderated":true,"is_public":true,"text":"the third message","updated_at":"2012-01-22T02:45:21+00:00","user":{"_id":"4f05ff1cef2c980001000006","affiliation":"Sunlight Foundation","created_at":"2012-01-05T19:50:52+00:00","email":"ddrinkard@sunlightfoundation.com","name":"Dan Drinkard","updated_at":"2012-01-22T18:06:03+00:00","url":"http://sunlightfoundation.com/people/ddrinkard/","small_avatar_url":"/static/user/avatar/4f05ff1cef2c980001000006/small_100x100_ddrinkard.jpg"}}],"next_page":null,"prev_page":null}}'
      ],
    archived: [
      200,
      {'Content-Type': 'application/json'},
      '{"chat":{"_id":"1","created_at":"2012-01-05T20:42:39+00:00","is_archived":true,"is_open":false,"updated_at":"2012-01-22T18:12:05+00:00"},"page":{"_id":"2","chat_id":"1","created_at":"2012-01-22T02:27:06+00:00","is_open":false,"updated_at":"2012-01-22T02:27:06+00:00","messages":[{"_id":"4f1b73fa340942000100001c","created_at":"2012-01-22T02:27:06+00:00","display_name":"Dan Drinkard","is_moderated":true,"is_public":true,"text":"the first message","updated_at":"2012-01-22T02:28:06+00:00","user":{"_id":"4f05ff1cef2c980001000006","affiliation":"Sunlight Foundation","created_at":"2012-01-05T19:50:52+00:00","email":"ddrinkard@sunlightfoundation.com","name":"Dan Drinkard","updated_at":"2012-01-22T18:06:03+00:00","url":"http://sunlightfoundation.com/people/ddrinkard/","small_avatar_url":"/static/user/avatar/4f05ff1cef2c980001000006/small_100x100_ddrinkard.jpg"}},{"_id":"4f1b73ff340942000100001e","created_at":"2012-01-22T02:27:11+00:00","display_name":"Dan Drinkard","is_moderated":true,"is_public":true,"text":"the second message","updated_at":"2012-01-22T02:27:11+00:00","user":{"_id":"4f05ff1cef2c980001000006","affiliation":"Sunlight Foundation","created_at":"2012-01-05T19:50:52+00:00","email":"ddrinkard@sunlightfoundation.com","name":"Dan Drinkard","updated_at":"2012-01-22T18:06:03+00:00","url":"http://sunlightfoundation.com/people/ddrinkard/","small_avatar_url":"/static/user/avatar/4f05ff1cef2c980001000006/small_100x100_ddrinkard.jpg"}},{"_id":"4f1b7409340942000100001f","created_at":"2012-01-22T02:27:21+00:00","display_name":"Dan Drinkard","is_moderated":true,"is_public":true,"text":"the third message","updated_at":"2012-01-22T02:45:21+00:00","user":{"_id":"4f05ff1cef2c980001000006","affiliation":"Sunlight Foundation","created_at":"2012-01-05T19:50:52+00:00","email":"ddrinkard@sunlightfoundation.com","name":"Dan Drinkard","updated_at":"2012-01-22T18:06:03+00:00","url":"http://sunlightfoundation.com/people/ddrinkard/","small_avatar_url":"/static/user/avatar/4f05ff1cef2c980001000006/small_100x100_ddrinkard.jpg"}}],"next_page":null,"prev_page":"/chats/1/pages/1.json"}}'
      ],
    error: [
      500,
      {'Content-Type': 'application/json'},
      ''
      ]
  },
  identity: {
    create: [
      200,
      {'Content-Type': 'application/json'},
      '{"display_name":"John Doe", "is_admin": false}'
      ],
    admin: [
      200,
      {'Content-Type': 'application/json'},
      '{"display_name":"John Doe", "is_admin": true}'
      ],
    destroy: [
      200,
      {'Content-Type': 'application/json'},
      '{"display_name": null, "is_admin": false}'
      ],
    confict: [
      200,
      {'Content-Type': 'application/json'},
      '{"errors":["Name is already registered, please choose another"]}'
      ],
    error: [
      500,
      {'Content-Type': 'application/json'},
      ''
      ]
  },
  message: {
    create: [
      200,
      {'Content-Type': 'application/json'},
      '{}'
      ],
    destroy: [
      200,
      {'Content-Type': 'application/json'},
      '{"_id":"1","created_at":"2012-01-23T22:42:01+00:00","display_name":"John doe","is_moderated":true,"is_public":true,"text":"[deleted]","updated_at":"2012-01-23T22:42:02+00:00","user":null}'
    ],
    edit: [
      200,
      {'Content-Type': 'application/json'},
      '{"_id":"1","created_at":"2012-01-23T22:42:01+00:00","display_name":"John doe","is_moderated":true,"is_public":true,"text":"ahh, this text is much shorter!","updated_at":"2012-01-23T22:42:02+00:00","user":null}'
    ]
  }
}