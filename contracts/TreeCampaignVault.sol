// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Adapted from Open Zeppelin's RefundVault

/**
 * @title Vault
 * @dev This contract is used for storing funds.
 */
contract TreeCampaignVault is Ownable {
    using SafeMath for uint256;

    struct TreeDeposit {
        address payable treeOwner; //who is contributing to the farmer
        uint256 firstDepositTimestamp;
        uint256 nextDisbursement;
        uint256 balance;
    }

    // Wallet from the project team
    address payable public trustedWallet;

    mapping(bytes32 => TreeDeposit) public deposits;

    event LogVaultCreated(address indexed wallet);
    event LogDeposited(
        address indexed contributor,
        bytes32 treeId,
        uint256 amount,
        uint256 firstDepositTimestamp
    );
    event LogRefunded(
        address indexed contributor,
        bytes32 treeId,
        uint256 amount
    );
    event LogFundsSentToWallet(
        bytes32 indexed treeId,
        address trustedWallet,
        uint256 amount
    );
    event LogAllFundsSentToWallet(
        bytes32 indexed treeId,
        address trustedWallet,
        uint256 amount
    );

    constructor(address payable _wallet) public {
        require(_wallet != address(0), "Wallet address should not be 0.");
        trustedWallet = _wallet;
        emit LogVaultCreated(_wallet);
    }

    function depositValue(
        address payable _contributor,
        string calldata _treeLocation
    ) external payable onlyOwner {
        //check if tree is available
        bytes32 _treeId = keccak256(abi.encodePacked(_treeLocation));
        TreeDeposit memory deposit = deposits[_treeId];
        require(deposit.treeOwner == address(0), "Tree must not have an owner");
        require(deposit.balance == 0, "Tree balance must be zero.");

        require(msg.value == 1 ether, "Each tree must cost 1 Ether");

        uint256 amount = msg.value;
        uint256 fee_10percent = amount.div(10);
        uint256 remain = amount.sub(fee_10percent);

        trustedWallet.transfer(fee_10percent); //first, transfer 10% to trusted wallet

        deposits[_treeId] = TreeDeposit({
            treeOwner: _contributor,
            firstDepositTimestamp: block.timestamp,
            nextDisbursement: (block.timestamp + 365 days),
            balance: remain
        });

        emit LogDeposited(_contributor, _treeId, msg.value, block.timestamp);
    }

    /// @dev Refunds ether to the contributors if in the contributors wants funds back.
    function refund(bytes32 _treeId) external {
        TreeDeposit storage deposit = deposits[_treeId];

        require(
            deposit.balance > 0,
            "Refund not allowed if deposit balance is 0."
        );
        require(
            deposit.treeOwner == msg.sender,
            "Only owner of the deposit can request a refund."
        );
        uint256 refundAmount = deposit.balance; //will refund what is lefted
        deposit.balance = 0;
        deposit.treeOwner.transfer(refundAmount);

        emit LogRefunded(deposit.treeOwner, _treeId, refundAmount);
    }

    /// @dev Sends the disbursement amount to the wallet after the disbursement period has passed. Can be called by anyone.
    function sendFundsToWallet(bytes32 _treeId) external {
        TreeDeposit storage deposit = deposits[_treeId];

        require(
            deposit.nextDisbursement <= block.timestamp,
            "Next disbursement period timestamp has not yet passed, too early to withdraw."
        );
        require(deposit.balance > 0, "TreeDeposit balance is 0.");

        if (
            block.timestamp > deposit.nextDisbursement &&
            block.timestamp < deposit.firstDepositTimestamp + 10 * (365 days)
        ) {
            uint256 initialDeposited = 1 ether;
            uint256 fee_10percent = initialDeposited.div(10);
            uint256 remain = deposit.balance.sub(fee_10percent);
            deposit.balance = remain;
            deposit.nextDisbursement = deposit.nextDisbursement + 365 days;
            trustedWallet.transfer(fee_10percent);
            emit LogFundsSentToWallet(_treeId, trustedWallet, fee_10percent);
        }
        //if more than 10 years has passed, all funds can be collected
        else if (
            block.timestamp >= deposit.firstDepositTimestamp + 10 * (365 days)
        ) {
            uint256 allFunds = deposit.balance;
            deposit.balance = 0;
            trustedWallet.transfer(allFunds);
            emit LogAllFundsSentToWallet(_treeId, trustedWallet, allFunds);
        }
    }
}
