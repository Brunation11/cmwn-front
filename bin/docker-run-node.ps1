# Powershell script for running processes in the front docker machine node container
# Usage: docker-run-node.ps1 -r <arg1>, <arg2>, ...
#   - Will run bash by default

Param(
   [String[]] $r
)
if ($r.Length -gt 0) {
    $args = "$r"
}
else {
    $args = 'bash'
}
$path = '/' + $PSScriptRoot -Replace '\\', '/' -Replace '/bin', '' -Replace 'C:', 'c'
& 'C:\Program Files\Docker Toolbox\docker-machine.exe' env front -shell=powershell | Invoke-Expression
docker run -it -e DOCKER_HOST_IP='192.168.99.100' -v $path`:/var/www cmwnfront_node $args
echo "If that didn't work, try running this instead:"
echo "docker run -it -e DOCKER_HOST_IP='192.168.99.100' -v $path`:/var/www cmwnfront_node $args"
