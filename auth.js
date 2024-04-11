const ts = Date.now();
const publicKey = "356dc0db4200232e692b539aaca9a9a4";
const privateKey = "136c8b9e7b01111c610e76e95b07055bdfd2fc9e";
const hash = CryptoJS.MD5(`${ts}${privateKey}${publicKey}`);
const appendParams = `ts=${ts}&hash=${hash}&apikey=${publicKey}`;
export default appendParams;
