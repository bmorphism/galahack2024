#!/usr/bin/env bash

source "$FABLO_NETWORK_ROOT/fabric-docker/scripts/channel-query-functions.sh"

set -eu

channelQuery() {
  echo "-> Channel query: " + "$@"

  if [ "$#" -eq 1 ]; then
    printChannelsHelp

  elif [ "$1" = "list" ] && [ "$2" = "curatororg" ] && [ "$3" = "peer0" ]; then

    peerChannelList "cli.curator.local" "peer0.curator.local:7041"

  elif
    [ "$1" = "list" ] && [ "$2" = "partnerorg1" ] && [ "$3" = "peer0" ]
  then

    peerChannelList "cli.partner1.local" "peer0.partner1.local:7061"

  elif

    [ "$1" = "getinfo" ] && [ "$2" = "product-channel" ] && [ "$3" = "curatororg" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "product-channel" "cli.curator.local" "peer0.curator.local:7041"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "product-channel" ] && [ "$4" = "curatororg" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "product-channel" "cli.curator.local" "$TARGET_FILE" "peer0.curator.local:7041"

  elif [ "$1" = "fetch" ] && [ "$3" = "product-channel" ] && [ "$4" = "curatororg" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "product-channel" "cli.curator.local" "${BLOCK_NAME}" "peer0.curator.local:7041" "$TARGET_FILE"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "product-channel" ] && [ "$3" = "partnerorg1" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "product-channel" "cli.partner1.local" "peer0.partner1.local:7061"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "product-channel" ] && [ "$4" = "partnerorg1" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "product-channel" "cli.partner1.local" "$TARGET_FILE" "peer0.partner1.local:7061"

  elif [ "$1" = "fetch" ] && [ "$3" = "product-channel" ] && [ "$4" = "partnerorg1" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "product-channel" "cli.partner1.local" "${BLOCK_NAME}" "peer0.partner1.local:7061" "$TARGET_FILE"

  else

    echo "$@"
    echo "$1, $2, $3, $4, $5, $6, $7, $#"
    printChannelsHelp
  fi

}

printChannelsHelp() {
  echo "Channel management commands:"
  echo ""

  echo "fablo channel list curatororg peer0"
  echo -e "\t List channels on 'peer0' of 'CuratorOrg'".
  echo ""

  echo "fablo channel list partnerorg1 peer0"
  echo -e "\t List channels on 'peer0' of 'PartnerOrg1'".
  echo ""

  echo "fablo channel getinfo product-channel curatororg peer0"
  echo -e "\t Get channel info on 'peer0' of 'CuratorOrg'".
  echo ""
  echo "fablo channel fetch config product-channel curatororg peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'CuratorOrg'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> product-channel curatororg peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'CuratorOrg'".
  echo ""

  echo "fablo channel getinfo product-channel partnerorg1 peer0"
  echo -e "\t Get channel info on 'peer0' of 'PartnerOrg1'".
  echo ""
  echo "fablo channel fetch config product-channel partnerorg1 peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'PartnerOrg1'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> product-channel partnerorg1 peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'PartnerOrg1'".
  echo ""

}
