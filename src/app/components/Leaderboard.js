import React from 'react';
import PropTypes from 'prop-types';

import InfiniteScroll from "react-infinite-scroll-component";

const LeaderboardRow = ({ rank, name, level, moves }) => (
    <div>
        <div className="leaderboard-row">
            <div className="leaderboard-row-item">
                {rank}
            </div>
            <div className="leaderboard-row-item">
                {name}
            </div>
            <div className="leaderboard-row-item">
                {level}
            </div>
            <div className="leaderboard-row-item">
                {moves}
            </div>
        </div>
    </div>
);

class Leaderboard extends React.Component {
    static propTypes = {
        entries: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                rank: PropTypes.number.isRequired,
                moves: PropTypes.number.isRequired,
                level: PropTypes.number.isRequired,
            }).isRequired,
        ),
    };

    static defaultProps = {
        entries: [],
    };

    state = {
        items: Array.from({ length: 20 }),
        hasMore: true
    };

    fetchMoreData = () => {
        if (this.state.items.length >= 500) {
            this.setState({ hasMore: false });
            return;
        }
        // a fake async api call like which sends
        // 20 more records in .5 secs
        setTimeout(() => {
            this.setState({
                items: this.state.items.concat(Array.from({ length: 20 }))
            });
        }, 500);
    };

    render() {
        const columns = ['Rank', 'Name', 'Level', 'Moves'];
        return (
            <div className="leaderboard">
                <div className="leaderboard-columns">
                    {columns.map(name => (
                        <div className="leaderboard-column-name">
                            {name}
                        </div>
                    ))}
                </div>
                <hr className="divider" />
                <InfiniteScroll
                    dataLength={this.state.items.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.hasMore}
                    loader={<h4>Loading...</h4>}
                    height={400}
                    endMessage={
                        <p style={{ textAlign: "center" }}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                >
                    {this.state.items.map((entry, index) => (
                        <LeaderboardRow
                            key={index}
                            rank={index + 1}
                            name={'marioqwe'}
                            level={100}
                            moves={50}
                        />
                    ))}
                </InfiniteScroll>
            </div>
        );
    }
}

export default Leaderboard;
