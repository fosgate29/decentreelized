// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Token is ERC721, Ownable {
    address payable public _owner;
    mapping(uint256 => bool) public minted;

    event Mint(address from, address to, uint256 id);

    constructor() ERC721("Decentreelized Token", "TRE") {
        _owner = msg.sender;
    }

    function mintToken(
        address _to,
        uint256 _tokenID,
        string memory _tokenURI
    ) public returns (bool) {
        uint256 _tokenId = totalSupply() + 1;

        _mint(address(this), _tokenId);
        _setTokenURI(_tokenId, _tokenURI);

        return true;

        emit Mint(address(0), _to, _tokenId);
    }
}
