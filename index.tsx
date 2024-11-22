import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, Pressable } from 'react-native';

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedButton, setSelectedButton] = useState('');
  const [counters, setCounters] = useState<Record<string, number>>({});
  const [purpleModalVisible, setPurpleModalVisible] = useState(false);
  const [previousCount, setPreviousCount] = useState<number>(0);

  const buttons = [
    { id: 1, title: 'Button 1', image: { uri: 'https://e7.pngegg.com/pngimages/298/457/png-clipart-red-circle-button-miscellaneous-button-png.png' } },
    { id: 2, title: 'Button 2', image: { uri: 'https://flexible.img.hani.co.kr/flexible/normal/970/777/imgdb/resize/2019/0926/00501881_20190926.JPG' } },
    { id: 3, title: 'Button 3', image: { uri: 'https://e7.pngegg.com/pngimages/298/457/png-clipart-red-circle-button-miscellaneous-button-png.png' } },
    { id: 4, title: 'Button 4', image: { uri: 'https://flexible.img.hani.co.kr/flexible/normal/970/777/imgdb/resize/2019/0926/00501881_20190926.JPG' } },
    { id: 5, title: 'Button 5', image: { uri: 'https://e7.pngegg.com/pngimages/298/457/png-clipart-red-circle-button-miscellaneous-button-png.png' } },
    { id: 6, title: 'Button 6', image: { uri: 'https://flexible.img.hani.co.kr/flexible/normal/970/777/imgdb/resize/2019/0926/00501881_20190926.JPG' } },
    { id: 7, title: 'Button 7', image: { uri: 'https://e7.pngegg.com/pngimages/298/457/png-clipart-red-circle-button-miscellaneous-button-png.png' } },
    { id: 8, title: 'Button 8', image: { uri: 'https://flexible.img.hani.co.kr/flexible/normal/970/777/imgdb/resize/2019/0926/00501881_20190926.JPG' } },
    { id: 9, title: 'Button 9', image: { uri: 'https://e7.pngegg.com/pngimages/298/457/png-clipart-red-circle-button-miscellaneous-button-png.png' } },
  ];

  const handlePress = (title: string) => {
    const ttsMessage = `${title}을 선택하셨습니다. 원하시는 작업을 선택해주세요: 구매는 YES(파란색), 취소는 NO(노란색), 수량 증가를 원하면 +(초록색), 수량 감소를 원하면 -(빨간색) 버튼을 눌러주세요.`;
    const speech = new window.SpeechSynthesisUtterance(ttsMessage);
    window.speechSynthesis.speak(speech);
    setSelectedButton(title);
    setPreviousCount(counters[title] || 0);
    setModalVisible(true);
  };

  const handleModalButtonPress = (buttonName: string) => {
    const ttsMessage = `You pressed ${buttonName}`;
    const speech = new window.SpeechSynthesisUtterance(ttsMessage);
    window.speechSynthesis.speak(speech);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {buttons.map((button) => (
          <TouchableOpacity key={button.id} style={styles.button} onPress={() => handlePress(button.title)}>
            <Image source={button.image} style={styles.image} />
            <Text style={styles.text}>{button.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <ScrollView horizontal contentContainerStyle={styles.footerContainer} showsHorizontalScrollIndicator={false}>
          {Object.keys(counters).map((key) => (
            <View key={key} style={styles.footerItem}>
              <Text style={styles.footerText}>
                {key} * {counters[key]}
              </Text>
              <Pressable
                style={[styles.counterButton, styles.buttonMinus]}
                onPress={() => {
                  setCounters((prevCounters) => {
                    const newCounters = { ...prevCounters };
                    delete newCounters[key];
                    return newCounters;
                  });
                }}
              >
                <Text style={styles.textStyle}>-</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
        <Pressable style={styles.purpleButton} onPress={() => setPurpleModalVisible(true)}>
          <Text style={styles.purpleButtonText}>Purple Button</Text>
        </Pressable>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{selectedButton}</Text>
            <Text style={styles.modalText}>Do you want to proceed?</Text>
            <View style={styles.counterContainer}>
              <Pressable
                style={[styles.counterButton, styles.buttonMinus]}
                onPress={() => {
                  handleModalButtonPress('Minus');
                  setCounters((prevCounters) => ({
                    ...prevCounters,
                    [selectedButton]: (prevCounters[selectedButton] || 1) > 1 ? prevCounters[selectedButton] - 1 : 1,
                  }));
                }}
              >
                <Text style={styles.textStyle}>-</Text>
              </Pressable>
              <Text style={styles.counterText}>{counters[selectedButton] || 1}</Text>
              <Pressable
                style={[styles.counterButton, styles.buttonPlus]}
                onPress={() => {
                  handleModalButtonPress('Plus');
                  setCounters((prevCounters) => ({
                    ...prevCounters,
                    [selectedButton]: (prevCounters[selectedButton] || 1) + 1,
                  }));
                }}
              >
                <Text style={styles.textStyle}>+</Text>
              </Pressable>
            </View>
            <View style={styles.modalButtonContainer}>
              <Pressable
                style={[styles.buttonModal, styles.buttonClose]}
                onPress={() => {
                  handleModalButtonPress('No');
                  setModalVisible(!modalVisible);
                  setCounters((prevCounters) => ({
                    ...prevCounters,
                    [selectedButton]: previousCount,
                  }));
                  setSelectedButton('');
                }}
              >
                <Text style={styles.textStyle}>No</Text>
              </Pressable>
              <Pressable
                style={[styles.buttonModal, styles.buttonYes]}
                onPress={() => {
                  handleModalButtonPress('Yes');
                  setCounters((prevCounters) => ({
                    ...prevCounters,
                    [selectedButton]: (prevCounters[selectedButton] || 0) + 1,
                  }));
                  setModalVisible(!modalVisible);
                  setSelectedButton('');
                }}
              >
                <Text style={styles.textStyle}>Yes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={purpleModalVisible}
        onRequestClose={() => {
          setPurpleModalVisible(!purpleModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Purple Button Modal</Text>
            <Text style={styles.modalText}>This is a modal triggered by the purple button.</Text>
            <ScrollView contentContainerStyle={styles.footerContainer} showsHorizontalScrollIndicator={false}>
              {Object.keys(counters).map((key) => (
                <View key={key} style={styles.footerItem}>
                  <Text style={styles.footerText}>
                    {key} was selected {counters[key]} times
                  </Text>
                </View>
              ))}
            </ScrollView>
            <Pressable
              style={[styles.buttonModal, styles.buttonClose]}
              onPress={() => {
                setPurpleModalVisible(!purpleModalVisible);
              }}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  footer: {
    flexDirection: 'row',
    paddingVertical: 10,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerText: {
    color: 'white',
    fontSize: 16,
    marginVertical: 2,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#000000',
  },
  button: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.5%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonModal: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonClose: {
    backgroundColor: '#FFD700',
  },
  buttonYes: {
    backgroundColor: '#0000FF'
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  counterButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    minWidth: 50,
    alignItems: 'center',
  },
  buttonMinus: {
    backgroundColor: '#f44336',
  },
  buttonPlus: {
    backgroundColor: '#4CAF50',
  },
  counterText: {
    fontSize: 20,
    marginHorizontal: 20,
  },
  purpleButton: {
    backgroundColor: '#DDA0DD',
    padding: 15,
    borderRadius: 10,
    marginLeft: 10,
  },
  purpleButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default App;
