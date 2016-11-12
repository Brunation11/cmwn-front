tmux -2 new-session -d -s front
sleep 5
tmux split-window -h -p 30 -t front
tmux split-window -v -p 70 -t front
tmux split-window -v -p 30 -t front
tmux select-pane -t 0
tmux send-keys -t 1 "gulp watch" C-m
tmux send-keys -t 2 "gulp watch-test" C-m
tmux send-keys -t 3 "gulp watch-lint" C-m
tmux attach-session -t front

