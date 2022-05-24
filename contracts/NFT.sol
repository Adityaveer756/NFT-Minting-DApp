//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721, Ownable {

    uint public mintPrice;
    uint public totalMinted;
    uint public maxSupply;
    uint public maxMintPerWallet;
    bool public publicMintEnabled;
    string internal baseTokenUri;
    address payable public withdrawWallet;
    mapping( address => uint) public mintPerWallet;

    constructor(string memory uri_) payable ERC721("Cyberbots", "CBT"){
        mintPrice = 0.001 ether;
        totalMinted = 0;
        maxSupply = 10;
        maxMintPerWallet = 2;
        baseTokenUri = uri_;
        withdrawWallet = payable(msg.sender);
    }

    function setPublicMintEnabled(bool state_) external onlyOwner {
        publicMintEnabled = state_ ;
    }

    function setWithdrawWallet(address walletAddress) external onlyOwner {
        withdrawWallet = payable(walletAddress);
    }

    function changeMintLimit(uint _quantity) external onlyOwner {
        maxMintPerWallet = _quantity;
    }

    function tokenURI(uint tokenId_) public view override returns(string memory){
        require(_exists(tokenId_), "Token does not exist!");
        return string(abi.encodePacked(baseTokenUri, Strings.toString(tokenId_), ".json"));
    }

    function withdraw() external onlyOwner {
        (bool success,) = withdrawWallet.call{ value: address(this).balance }('');
        require(success, "withdraw failed");
    }

    function mint( uint quantity_) public payable {
        require(publicMintEnabled, "minting not enabled");
        require(totalMinted + quantity_ <= maxSupply, "sold out");
        
        if( msg.sender != owner() ){
            console.log(owner());
            require(msg.value == quantity_ * mintPrice, "wrong mint value");
            require(mintPerWallet[msg.sender] + quantity_ <= maxMintPerWallet, "mint limit exceeded");
        }

        for( uint i=1; i<=quantity_; i++ ){
            mintPerWallet[msg.sender]++;
            totalMinted++;
            uint tokenId = totalMinted;
            _safeMint(msg.sender, tokenId);
        }
    }

}