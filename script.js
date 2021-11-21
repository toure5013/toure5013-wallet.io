// user details 
const userInfo = {
 avatar: 'https://media-exp1.licdn.com/dms/image/C4D03AQF02RvTyvVMqg/profile-displayphoto-shrink_100_100/0/1634388321764?e=1643241600&v=beta&t=ZKlm8LW7l7YAPhaxM31KklzQLrXnnU27RKA-Hbytf5A', 
 hero: 'https://media-exp1.licdn.com/dms/image/C4D16AQGS4AZIiRYZAw/profile-displaybackgroundimage-shrink_350_1400/0/1634300565626?e=1643241600&v=beta&t=Fwq4EOJKCDnJF7SdvtiTg20hLIRBAjHm1-AZWeIa_o4', 
 website: 'https://github.com/toure5013', 
 name: 'TOURE SOULEYMANE', 
 info: 'Fullstack Web/Mobile/Chatbot/Blockchain Developer', 
}; 

// crypto wallets 
const cryptoWallets = [
 {
  symbol: 'BTC', 
  name: 'Bitcoin',
  address: 'bc1qmyuj784ay8ttas320dps2q68xvmez6n8hqy87m', 
 }, 
 {
  symbol: 'ETH', 
  name: 'Etherium',
  address: '0x8a203C8523d5Dca33f6CDAf3c220565a7e935c04', 
 }, 
 {
  symbol: 'LTC', 
  name: 'Litecoin',
  address: 'LgKxe22pt8qP3RHsNEXw7GzcFdzNBHnZEy', 
 }, 
 {
  symbol: 'BNB', 
  name: 'SMART CHAIN',
  address: '0x8a203C8523d5Dca33f6CDAf3c220565a7e935c04', 
 }, 
 {
  symbol: 'DOGE', 
  name: 'DOGECOIN',
  address: 'D5RsP4aqP3gWtjnf834HArrN9hp98PB4s9', 
 },
 {
    symbol: 'TRX', 
    name: 'TRON',
    address: 'TKaFfGEVgk8WWcSXskF93MPWJewYMVkjiq', 
   },
   {
    symbol: 'NFT', 
    name: 'NFT',
    address: '0x8a203C8523d5Dca33f6CDAf3c220565a7e935c04', 
   },
];

// number format filter 
Vue.filter( 'toMoney', ( num, decimals ) => {
 let o = { style: 'decimal', minimumFractionDigits: decimals, maximumFractionDigits: decimals };
 return new Intl.NumberFormat( 'en-US', o ).format( num );
});

// vue instance 
new Vue({
 el: '#card', 
 
 // app data 
 data: {
  userInfo, 
  cryptoWallets,
  tab: 'BTC', 
  wallet: {}, 
  statsCache: {}, 
  stats: {}, 
 }, 
 
 // computed methods 
 computed: {
  
  // compute list wallets for tabs 
  walletsList() {
   return this.cryptoWallets.map( w => {
    w.active = ( w.symbol === this.tab ); 
    return w;
   }); 
  }, 
 }, 
 
 // custom methods 
 methods: {
  
  // select active tab wallet 
  selectWallet( symbol ) {
   let wallet = this.cryptoWallets.filter( w => w.symbol === symbol ).shift(); 
   if ( !wallet ) return; 
   wallet.copied = 0; 
   this.wallet = wallet;  
   this.tab = symbol; 
   this.fetchStats( symbol ); 
  },  
  
  // copy text to clipboard
  copyText( txt ) {
   txt = String( txt || '' ).trim();
   if ( !txt ) return;
   let input = document.createElement( 'input' );
   document.body.appendChild( input );
   input.value = txt;
   input.select();
   document.execCommand( 'Copy' );
   document.body.removeChild( input ); 
   this.wallet = Object.assign( {}, this.wallet, { copied: 1 } ); 
  },
  
  // get qr image url for selected wallet 
  getQrImage() {
   const w = 180; 
   const h = 180; 
   const a = this.wallet.address; 
   return `https://chart.googleapis.com/chart?chs=${w}x${h}&cht=qr&choe=UTF-8&chl=${a}`;
  }, 
  
  // set coin stats 
  setStats( symbol, data ) {
   let price  = 0;
   let cap    = 0;
   let supply = 0;
   let time   = Date.now(); 
   let stats  = Object.assign( { price, cap, supply, time }, data ); 
   this.statsCache[ symbol ] = stats; 
   this.stats = stats; 
  }, 
  
  // fetch market stats for a symbol 
  fetchStats( symbol ) {
   let stats = this.statsCache[ symbol ] || null; 
   let price = stats ? stats.price : 0; 
   let secs  = stats ? ( ( Date.now() - stats.time ) / 1000 ) : 0; 
   
   // use values from cache 
   if ( price && secs < 300 ) {
    return this.setStats( symbol, stats );
   }
   // reset and fetch new values from api 
   this.setStats( symbol ); 
   const xhr = new XMLHttpRequest();
   xhr.open( 'GET', 'https://coincap.io/page/'+ symbol, true );
   xhr.setRequestHeader( 'X-Requested-With', 'XMLHttpRequest' );
   xhr.responseType = 'json';
   xhr.addEventListener( 'load', e => { 
    if ( !xhr.response || !xhr.response.id ) return;  
    let price  = parseFloat( xhr.response.price ) || 0; 
    let cap    = parseFloat( xhr.response.market_cap ) || 0; 
    let supply = parseFloat( xhr.response.supply ) || 0; 
    this.setStats( symbol, { price, cap, supply } ); 
   });
   xhr.send();
  }, 
 }, 
 
 // when component mounts 
 mounted() {
  this.selectWallet( this.tab ); 
 }, 
});