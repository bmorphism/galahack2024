#!/usr/bin/env bash

generateArtifacts() {
  printHeadline "Generating basic configs" "U1F913"

  printItalics "Generating crypto material for OrdererOrg" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-ordererorg.yaml" "peerOrganizations/orderer.local" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating crypto material for CuratorOrg" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-curatororg.yaml" "peerOrganizations/curator.local" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating crypto material for PartnerOrg1" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-partnerorg1.yaml" "peerOrganizations/partner1.local" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating crypto material for UsersOrg1" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-usersorg1.yaml" "peerOrganizations/users1.local" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating genesis block for group group1" "U1F3E0"
  genesisBlockCreate "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config" "Group1Genesis"

  # Create directory for chaincode packages to avoid permission errors on linux
  mkdir -p "$FABLO_NETWORK_ROOT/fabric-config/chaincode-packages"
}

startNetwork() {
  printHeadline "Starting network" "U1F680"
  (cd "$FABLO_NETWORK_ROOT"/fabric-docker && docker-compose up -d)
  sleep 4
}

generateChannelsArtifacts() {
  printHeadline "Generating config for 'product-channel'" "U1F913"
  createChannelTx "product-channel" "$FABLO_NETWORK_ROOT/fabric-config" "ProductChannel" "$FABLO_NETWORK_ROOT/fabric-config/config"
}

installChannels() {
  printHeadline "Creating 'product-channel' on CuratorOrg/peer0" "U1F63B"
  docker exec -i cli.curator.local bash -c "source scripts/channel_fns.sh; createChannelAndJoin 'product-channel' 'CuratorOrg' 'peer0.curator.local:7041' 'crypto/users/Admin@curator.local/msp' 'orderer0.group1.orderer.local:7030';"

  printItalics "Joining 'product-channel' on  PartnerOrg1/peer0" "U1F638"
  docker exec -i cli.partner1.local bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'product-channel' 'PartnerOrg1' 'peer0.partner1.local:7061' 'crypto/users/Admin@partner1.local/msp' 'orderer0.group1.orderer.local:7030';"
}

installChaincodes() {
  if [ -n "$(ls "$CHAINCODES_BASE_DIR/..")" ]; then
    printHeadline "Approving 'basic-product' for CuratorOrg (dev mode)" "U1F60E"
    chaincodeApprove "cli.curator.local" "peer0.curator.local:7041" "product-channel" "basic-product" "0.0.1" "orderer0.group1.orderer.local:7030" "" "false" "" ""
    printHeadline "Approving 'basic-product' for PartnerOrg1 (dev mode)" "U1F60E"
    chaincodeApprove "cli.partner1.local" "peer0.partner1.local:7061" "product-channel" "basic-product" "0.0.1" "orderer0.group1.orderer.local:7030" "" "false" "" ""
    printItalics "Committing chaincode 'basic-product' on channel 'product-channel' as 'CuratorOrg' (dev mode)" "U1F618"
    chaincodeCommit "cli.curator.local" "peer0.curator.local:7041" "product-channel" "basic-product" "0.0.1" "orderer0.group1.orderer.local:7030" "" "false" "" "peer0.curator.local:7041,peer0.partner1.local:7061" "" ""
  else
    echo "Warning! Skipping chaincode 'basic-product' installation. Chaincode directory is empty."
    echo "Looked in dir: '$CHAINCODES_BASE_DIR/..'"
  fi

}

installChaincode() {
  local chaincodeName="$1"
  if [ -z "$chaincodeName" ]; then
    echo "Error: chaincode name is not provided"
    exit 1
  fi

  local version="$2"
  if [ -z "$version" ]; then
    echo "Error: chaincode version is not provided"
    exit 1
  fi

  if [ "$chaincodeName" = "basic-product" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/..")" ]; then
      printHeadline "Packaging chaincode 'basic-product'" "U1F60E"
      chaincodeBuild "basic-product" "node" "$CHAINCODES_BASE_DIR/.." "16"
      chaincodePackage "cli.curator.local" "peer0.curator.local:7041" "basic-product" "$version" "node" printHeadline "Installing 'basic-product' for CuratorOrg" "U1F60E"
      chaincodeInstall "cli.curator.local" "peer0.curator.local:7041" "basic-product" "$version" ""
      chaincodeApprove "cli.curator.local" "peer0.curator.local:7041" "product-channel" "basic-product" "$version" "orderer0.group1.orderer.local:7030" "" "false" "" ""
      printHeadline "Installing 'basic-product' for PartnerOrg1" "U1F60E"
      chaincodeInstall "cli.partner1.local" "peer0.partner1.local:7061" "basic-product" "$version" ""
      chaincodeApprove "cli.partner1.local" "peer0.partner1.local:7061" "product-channel" "basic-product" "$version" "orderer0.group1.orderer.local:7030" "" "false" "" ""
      printItalics "Committing chaincode 'basic-product' on channel 'product-channel' as 'CuratorOrg'" "U1F618"
      chaincodeCommit "cli.curator.local" "peer0.curator.local:7041" "product-channel" "basic-product" "$version" "orderer0.group1.orderer.local:7030" "" "false" "" "peer0.curator.local:7041,peer0.partner1.local:7061" "" ""

    else
      echo "Warning! Skipping chaincode 'basic-product' install. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/..'"
    fi
  fi
}

runDevModeChaincode() {
  local chaincodeName=$1
  if [ -z "$chaincodeName" ]; then
    echo "Error: chaincode name is not provided"
    exit 1
  fi

  if [ "$chaincodeName" = "basic-product" ]; then
    local version="0.0.1"
    printHeadline "Approving 'basic-product' for CuratorOrg (dev mode)" "U1F60E"
    chaincodeApprove "cli.curator.local" "peer0.curator.local:7041" "product-channel" "basic-product" "0.0.1" "orderer0.group1.orderer.local:7030" "" "false" "" ""
    printHeadline "Approving 'basic-product' for PartnerOrg1 (dev mode)" "U1F60E"
    chaincodeApprove "cli.partner1.local" "peer0.partner1.local:7061" "product-channel" "basic-product" "0.0.1" "orderer0.group1.orderer.local:7030" "" "false" "" ""
    printItalics "Committing chaincode 'basic-product' on channel 'product-channel' as 'CuratorOrg' (dev mode)" "U1F618"
    chaincodeCommit "cli.curator.local" "peer0.curator.local:7041" "product-channel" "basic-product" "0.0.1" "orderer0.group1.orderer.local:7030" "" "false" "" "peer0.curator.local:7041,peer0.partner1.local:7061" "" ""

  fi
}

upgradeChaincode() {
  local chaincodeName="$1"
  if [ -z "$chaincodeName" ]; then
    echo "Error: chaincode name is not provided"
    exit 1
  fi

  local version="$2"
  if [ -z "$version" ]; then
    echo "Error: chaincode version is not provided"
    exit 1
  fi

  if [ "$chaincodeName" = "basic-product" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/..")" ]; then
      printHeadline "Packaging chaincode 'basic-product'" "U1F60E"
      chaincodeBuild "basic-product" "node" "$CHAINCODES_BASE_DIR/.." "16"
      chaincodePackage "cli.curator.local" "peer0.curator.local:7041" "basic-product" "$version" "node" printHeadline "Installing 'basic-product' for CuratorOrg" "U1F60E"
      chaincodeInstall "cli.curator.local" "peer0.curator.local:7041" "basic-product" "$version" ""
      chaincodeApprove "cli.curator.local" "peer0.curator.local:7041" "product-channel" "basic-product" "$version" "orderer0.group1.orderer.local:7030" "" "false" "" ""
      printHeadline "Installing 'basic-product' for PartnerOrg1" "U1F60E"
      chaincodeInstall "cli.partner1.local" "peer0.partner1.local:7061" "basic-product" "$version" ""
      chaincodeApprove "cli.partner1.local" "peer0.partner1.local:7061" "product-channel" "basic-product" "$version" "orderer0.group1.orderer.local:7030" "" "false" "" ""
      printItalics "Committing chaincode 'basic-product' on channel 'product-channel' as 'CuratorOrg'" "U1F618"
      chaincodeCommit "cli.curator.local" "peer0.curator.local:7041" "product-channel" "basic-product" "$version" "orderer0.group1.orderer.local:7030" "" "false" "" "peer0.curator.local:7041,peer0.partner1.local:7061" "" ""

    else
      echo "Warning! Skipping chaincode 'basic-product' upgrade. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/..'"
    fi
  fi
}

notifyOrgsAboutChannels() {
  printHeadline "Creating new channel config blocks" "U1F537"
  createNewChannelUpdateTx "product-channel" "CuratorOrg" "ProductChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"
  createNewChannelUpdateTx "product-channel" "PartnerOrg1" "ProductChannel" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"

  printHeadline "Notyfing orgs about channels" "U1F4E2"
  notifyOrgAboutNewChannel "product-channel" "CuratorOrg" "cli.curator.local" "peer0.curator.local" "orderer0.group1.orderer.local:7030"
  notifyOrgAboutNewChannel "product-channel" "PartnerOrg1" "cli.partner1.local" "peer0.partner1.local" "orderer0.group1.orderer.local:7030"

  printHeadline "Deleting new channel config blocks" "U1F52A"
  deleteNewChannelUpdateTx "product-channel" "CuratorOrg" "cli.curator.local"
  deleteNewChannelUpdateTx "product-channel" "PartnerOrg1" "cli.partner1.local"
}

printStartSuccessInfo() {
  printHeadline "Done! Enjoy your fresh network" "U1F984"
  echo "It has peerDevMode enabled, so remember to start your chaincodes manually."
}

stopNetwork() {
  printHeadline "Stopping network" "U1F68F"
  (cd "$FABLO_NETWORK_ROOT"/fabric-docker && docker-compose stop)
  sleep 4
}

networkDown() {
  printHeadline "Destroying network" "U1F916"
  (cd "$FABLO_NETWORK_ROOT"/fabric-docker && docker-compose down)

  printf "\nRemoving chaincode containers & images... \U1F5D1 \n"
  for container in $(docker ps -a | grep "dev-peer0.curator.local-basic-product" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.curator.local-basic-product*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer0.partner1.local-basic-product" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.partner1.local-basic-product*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done

  printf "\nRemoving generated configs... \U1F5D1 \n"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/config"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/crypto-config"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/chaincode-packages"

  printHeadline "Done! Network was purged" "U1F5D1"
}
