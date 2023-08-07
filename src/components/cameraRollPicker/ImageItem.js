import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity, View,
} from 'react-native';
import PropTypes from 'prop-types';
import colors from "../../Styles";
import FastImage from 'react-native-fast-image'
import {MText as Text} from '../../components'

const styles = StyleSheet.create({
  marker: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'transparent',
    width: 20,
    height: 20,
    borderWidth: 2, borderRadius: 10, borderColor: colors.primary
  },
});

class ImageItem extends Component {
  componentWillMount() {
    let { width } = Dimensions.get('window');
    const { imageMargin, imagesPerRow, containerWidth } = this.props;

    if (typeof containerWidth !== 'undefined') {
      width = containerWidth;
    }
    this.imageSize = (width - (imagesPerRow + 1) * imageMargin) / imagesPerRow;
  }

  handleClick(item) {
    this.props.onClick(item);
  }

  fancyTimeFormat(duration) {
    try{
      // Hours, minutes and seconds
      const hrs = ~~(duration / 3600);
      const mins = ~~((duration % 3600) / 60);
      const secs = ~~duration % 60;

      // Output like "1:01" or "4:03:59" or "123:03:59"
      let ret = "";

      if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
      }

      ret += "" + mins + ":" + (secs < 10 ? "0" : "");
      ret += "" + secs;

      return ret;
    }catch (e) {
      return ''
    }

  }

  arrayObjectIndexOf = (array, property, value) => array.map(o => o[property]).indexOf(value);

  render() {
    const {
      item, selected, selectedMarker, imageMargin, selectedList,
    } = this.props;
    const { image } = item.node;

    const indexSelected = this.arrayObjectIndexOf(selectedList?selectedList:[], 'uri', image.uri);


    const marker =  <View
      style={[styles.marker, { width: 20, height: 20, backgroundColor: selected?colors.primary: 'transparent'  }]}
    >
      {
        selected &&
        <Text style={{fontWeight: '600', fontSize: 15, color: 'white', marginTop: -4, textAlign: 'center'}}>{indexSelected+1}</Text>
      }
    </View>;


    return (
      <TouchableOpacity
        style={{ marginBottom: imageMargin, marginRight: imageMargin }}
        onPress={() => this.handleClick(image)}
      >
        <Image
          source={{ uri: image.uri }}
          style={{ height: this.imageSize, width: this.imageSize, backgroundColor: 'grey' }}
        />
        { marker }
        {
          (item.node.type==='video' || (image.playableDuration!==null &&image.playableDuration>0)) &&
          <Text style={{position: 'absolute', fontSize: 12, color: '#fffffffa', bottom: 10, right: 8}}>{this.fancyTimeFormat(image.playableDuration)}</Text>
        }
      </TouchableOpacity>
    );
  }
}

ImageItem.defaultProps = {
  item: {},
  selected: false,
};

ImageItem.propTypes = {
  item: PropTypes.object,
  selected: PropTypes.bool,
  selectedMarker: PropTypes.element,
  imageMargin: PropTypes.number,
  imagesPerRow: PropTypes.number,
  onClick: PropTypes.func,
};

export default ImageItem;
