const PEER_ID = 'pavan142-foo'

var initiateRequestBtn, acceptRequestBtn;

document.addEventListener('DOMContentLoaded', () => {
  console.log("domcontent loaded event is fired")
  initiateRequestBtn = document.getElementById('initiate_request');
  acceptRequestBtn = document.getElementById('accept_request');

  initiateRequestBtn.onclick =  () => InitiateRequest(getCode());
  acceptRequestBtn.onclick =  () => AcceptRequest(getCode());
})

function getCode() {
  let code = document.getElementById('meeting_code').value;
  code = (code == "") ? PEER_ID : code;
  console.log(code);
  return code;
}

function InitiateRequest(id) {
  console.log("Initiaing Request with id", id);
  initiateRequestBtn.innerText= "Calling...";
  peer = new Peer(id, {
    debug: 0
  });
  peer.on('open', (id) => {
    console.log('my id is ', id);
  })
  peer.on('connection', (conn) => {
    console.log('received connection event');
    document.body.style.backgroundColor = "orange";
    conn.on('data', (data) => {
      console.log('got data', data);
    })
  })
}

function AcceptRequest(dest_id) {
  console.log("Accepting Request with dest_id", dest_id);
  acceptRequestBtn.innerText = "Joining...";
  peer = new Peer({
    debug: 0
  });
  peer.on('open', (my_id) => {
    console.log('my id is ', my_id);
    conn = peer.connect(dest_id);
    conn.on('open', () => {
      document.body.style.backgroundColor = "pink";
      console.log("connection opened");
      conn.send('hi says the acceptor');
    })
  })

}

function VideoCall() {
  var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  getUserMedia({
    video: true,
    audio: true
  }, function (stream) {
    var call = peer.call(PEER_ID, stream);
    call.on('stream', function (remoteStream) {
      // Show stream in some video/canvas element.
    });
  }, function (err) {
    console.log('Failed to get local stream', err);
  });
}

function AnswerVideoCall() {
  var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  peer.on('call', function (call) {
    getUserMedia({
      video: true,
      audio: true
    }, function (stream) {
      call.answer(stream); // Answer the call with an A/V stream.
      call.on('stream', function (remoteStream) {
        // Show stream in some video/canvas element.
      });
    }, function (err) {
      console.log('Failed to get local stream', err);
    });
  });

}