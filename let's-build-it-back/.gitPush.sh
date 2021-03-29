#!/bin/bash

usage() {
    echo "optional arguments:
                    -h, --help         Display Menu 
                    -p pull and not push 
                    -f force the command
                    -t auto add time to the commit
                    -d run in dev mode (will print)  
                    -a commmit -am insted of commit -m 
                    ??? all string send will be the commit name
                    " 1>&2
    exit 1
}

while true; do
    case "$1" in
    -d)
        devmode=true
        if [ $devmode ]; then echo $1; fi
        shift
        ;;
    -a)
        a='a'
        if [ $devmode ]; then echo $1; fi
        shift
        ;;
    -f)
        force=true
        if [ $devmode ]; then echo $1; fi
        shift
        ;;
    -t)
        autoDate=true
        if [ $devmode ]; then echo $1; fi
        shift
        ;;
    -p)
        pull=true
        if [ $devmode ]; then echo $1; fi
        shift
        ;;
    -h)
        usage
        ;;
    *)
        if [ $devmode ]; then echo $1; fi
        if ! [ -z "$1" ]; then
            if [ ${1:0:1} == '-' ]; then
                echo "wrong use"
                usage
            fi
            commit=$1
            shift
        else
            break
        fi
        ;;
    esac
done

if [ $devmode ]; then echo "force=$force pull=$pull commit=$commit"; fi

gitPush() {
    # if [ -n "$(git status - porcelain)" ];
    # then
    #     echo "IT IS CLEAN"
    #     return
    # fi
    branch=$(git branch --show-current)
    command="push"
    if [ $force ]; then force=" -f"; fi
    if ! [ "$commit" ]; then commit="auto-commit"; fi
    if [ $autoDate ]; then commit+=' '$(date); fi
    if [ $pull ]; then command="pull"; fi
    if [ $devmode ]; then echo "force=$force pull=$pull commit=$commit branch=$branch commit-type=-"$a"m"; fi
    echo "git $command$force origin $branch"
    git add .
    git commit -"$a"m "$commit"
    git $command$force origin $branch
}

gitPush
