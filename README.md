Change My World Now Platform 
============================

[![wercker status](https://app.wercker.com/status/89d783b307249e7b765a4d044ff24a0f/m "wercker status")](https://app.wercker.com/project/bykey/89d783b307249e7b765a4d044ff24a0f)


Requirements
------------

docker 1.11+
docker-compose 1.7+
VirtualBox 5.0+

Installing
----------

To setup the site, just run 

```bash
$ bin/install.sh
```

Development 
-----------

After you run the install script, you are ready to get started.  To start docker just run:

```bash
$ eval $(docker-machine env front)
$ docker-compose up -d
```

_Note: the -d flag means the container will run in the back ground_


FAQ:
---

__Q:__ I get the following error: "ERROR: Couldn't connect to Docker daemon - you might need to run 'docker-machine start default'."

__A:__ This happens when you restart your computer or when you open a new terminal window.  Run: ``eval $(docker-machine env front)``

__Q:__ How can I run commands in the docker container

__A:__ There is a default node container that you can use to run node type stuff.  In order to execute just run: `` docker-compose run node <command>``

__Q:__ Can I still use node on my host computer

__A:__ Yes you can.  Everything that happens in the root directory, will be transfered over to the container.  If you are on OSX, NFS
     is configured for file sharing.  On Windows, this is done through samba.  __NOTE__ There might be a slow delay in the transfer of files.

__Q:__ How do I connect to the containers?

__A:__ The containers are named in the docker-compose.yml file or, you can run ```docker ps ``` to see a list of all runnning containers.
    From that list, you can connect directly by running ```docker exec -it <INSERT CONTAINER NAME> bash ```