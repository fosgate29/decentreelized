// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Token is ERC721, Ownable {
    address payable public _owner;

    constructor() ERC721("Decentreelized Token", "TRE") {
        _owner = msg.sender;
    }

    function mintToken(string memory _tokenURI) 
        public payable returns (bool) {

        uint256 _tokenId = totalSupply() + 1;

        _mint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);

        return true;

       
    }
}
