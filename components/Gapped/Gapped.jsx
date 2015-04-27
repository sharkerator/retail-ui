var React = require('react');

/**
 * Контейнер, расстояние между элементами в котором равно `gap`.
 */
var Gapped = React.createClass({
  propTypes: {
    /**
     * Расстояние между элементами.
     */
    gap: React.PropTypes.number,
  },

  getDefaultProps() {
    return {
      gap: 10,
    };
  },

  render() {
    var itemStyle = {
      display: 'inline-block',
      marginRight: this.props.gap,
      marginTop: this.props.gap,
    };
    var children = React.Children.map(this.props.children, child => {
      if (!child) {
        return child;
      }
      return <span style={itemStyle}>{child}</span>;
    });
    return <div style={{marginTop: -this.props.gap}}>{children}</div>;
  },
});

module.exports = Gapped;