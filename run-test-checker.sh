#!/bin/bash

let run_yarn=1

isYarn=$(which yarn)
if [[ -z "$isYarn" ]] || [[ $isYarn == *"not found"* ]]
then
  run_yarn=0
fi


let numberOfTests=${1:-50}
if [[ $numberOfTests -lt 1 ]]
then
  exit
fi

echo "\033[1;32m$numberOfTests test cycle(s) started...\033[0m"

let errorCounter=0
let rounded=0

for ((i=1; i<=$numberOfTests; i++))
do

  percent=$(echo "100*$errorCounter/$numberOfTests" | bc -l)
  rounded=$(printf '%.*f\n' 1 $percent)

  if [[ $i == 1 ]]
  then
    echo "TEST $i"
  else
    echo "TEST $i: prev $errorCounter error(s) found [ \033[1;34m$rounded%\033[0m ]"
  fi

  if [[ $run_yarn == 1 ]]
  then
    yarn test > /dev/null
  else
    npm test > /dev/null
  fi

  if [[ $? -eq 0 ]]
  then
    echo "\033[1;33mTEST PASSED\033[0m"
  else
    echo "\033[1;31mTEST FAILED\033[0m"
    ((errorCounter++))
  fi

done

echo ""
echo "\033[1;32mTOTAL TEST(S): $numberOfTests\033[0m, \033[1;31mERROR(S): $errorCounter\033[0m [ \033[1;34m$rounded%\033[0m ]"
