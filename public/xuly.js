$(document).ready(function(){

    var currentAccount = null;
    var abi = [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "_a",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_m",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "_c",
                    "type": "string"
                }
            ],
            "name": "SomeoneJustPayMoney",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "arrayClient",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "_Adress",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_Money",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "_Content",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "clientCounter",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_ordering",
                    "type": "uint256"
                }
            ],
            "name": "get_1_Client",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                },
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_content",
                    "type": "string"
                }
            ],
            "name": "sendDonate",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalMoney",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
    var addressSM = "0xB16124F9C7db067685Bb7B6b2061eBB82b109fAB";

    check_MetaMask();

    //Contract MM
    const web3 = new Web3(window.ethereum);
    window.ethereum.enable();
    var contract_MM = new web3.eth.Contract(abi, addressSM);
    console.log(contract_MM);

    load_DanhSach_Client();

    //Contract Infura
    var provider = new Web3.providers.WebsocketProvider("wss://rinkeby.infura.io/ws/v3/19e9db8f4c214f7f87e25ce44a511ac5");
    var web3_infura = new Web3(provider);
    var contract_Infura = web3_infura.eth.Contract(abi, addressSM);
    console.log(contract_Infura);
    contract_Infura.events.SomeoneJustPayMoney({filter:{}, fromBlock:'latest'}, function(err, data){
        if(err){
            alert("Event error: " + err);
        }else{
            console.log(data);
            $("#tb_Clients").append(`
                <tr class="row">
                    <td>`+ data.returnValues[0] +`</td>
                    <td>`+ data.returnValues[1] +`</td>
                    <td>`+ data.returnValues[2] +`</td>
                </tr>
            `);
        }
    });

    $("#btn_connect_MM").click(function(){
        connect_MetaMask()
        .then((data)=>{
            currentAccount = data[0];
            $("#welcome").html("Welcome " + currentAccount);
            console.log("Current Account: " + currentAccount);
        })
        .catch((err)=>{
            console.log(err);
        });
    });

    $("#btn_Send").click(function(){
        if(currentAccount==null){
            alert("Vui lòng login Meta Mask");
        }else{
            var txt = $("#txt_Content").val();
            var eth = $("#txt_Money").val(); // 1
            contract_MM.methods.sendDonate(txt).send({
                from: currentAccount,
                value: web3.utils.toWei(eth, "ether")
            });
        }
    });

    function load_DanhSach_Client(){
        contract_MM.methods.clientCounter().call().then((data)=>{
            var tong = web3.utils.hexToNumber(data);
            for(var n=0; n<tong; n++){
                contract_MM.methods.get_1_Client(n).call().then((khach)=>{
                    console.log(khach);
                    $("#tb_Clients").append(`
                        <tr class="row">
                            <td>`+ khach[1] +`</td>
                            <td>`+ khach[2] +`</td>
                            <td>`+ khach[3] +`</td>
                        </tr>
                    `);
                });
            }
        });
    }

    window.ethereum.on('accountsChanged', function (accounts) {
        currentAccount = accounts[0];
        $("#welcome").html("Welcome " + currentAccount);
        console.log("Current Account: " + currentAccount);
    })

});



async function connect_MetaMask(){
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    return accounts;
}

function check_MetaMask(){
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        $("#mm").hide(0);
        $("#login").show(0);
    }else{
        console.log('MetaMask is not installed.');
        $("#mm").show(0);
        $("#login").hide(0);
    }
}