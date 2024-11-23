import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, Pressable, ActivityIndicator } from 'react-native';

const KioskApp = () => {
  // 상품 모달의 가시성을 관리하기 위한 상태 변수 (상품을 선택했을 때 모달을 띄울지 여부를 결정)
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  // 현재 선택된 상품을 저장하기 위한 상태 변수 (사용자가 선택한 상품의 이름을 저장)
  const [selectedProduct, setSelectedProduct] = useState('');
  // 각 상품의 수량을 저장하는 상태 변수 (상품 이름을 키로 하여 수량을 저장하는 객체 형태)
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  // 이전에 선택한 상품의 수량을 저장하기 위한 상태 변수 (사용자가 모달에서 변경 전 수량을 기억하기 위함)
  const [previousProductCount, setPreviousProductCount] = useState<number>(0);
  // 장바구니 모달의 가시성을 관리하기 위한 상태 변수 (장바구니 화면을 띄울지 여부를 결정)
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);
  // 결제 진행 여부를 나타내는 상태 변수 (결제가 진행 중인지 여부를 관리)
  const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);
  // 결제 모달의 가시성을 관리하기 위한 상태 변수 (결제 중 화면을 띄울지 여부를 결정)
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);

  // 상품 리스트 정의 (사용자가 선택할 수 있는 상품들의 목록)
  const products = [
    { id: 1, name: 'Product 1', image: { uri: 'https://e7.pngegg.com/pngimages/298/457/png-clipart-red-circle-button-miscellaneous-button-png.png' } },
    { id: 2, name: 'Product 2', image: { uri: 'https://flexible.img.hani.co.kr/flexible/normal/970/777/imgdb/resize/2019/0926/00501881_20190926.JPG' } },
    { id: 3, name: 'Product 3', image: { uri: 'https://e7.pngegg.com/pngimages/298/457/png-clipart-red-circle-button-miscellaneous-button-png.png' } },
    { id: 4, name: 'Product 4', image: { uri: 'https://flexible.img.hani.co.kr/flexible/normal/970/777/imgdb/resize/2019/0926/00501881_20190926.JPG' } },
    { id: 5, name: 'Product 5', image: { uri: 'https://e7.pngegg.com/pngimages/298/457/png-clipart-red-circle-button-miscellaneous-button-png.png' } },
    { id: 6, name: 'Product 6', image: { uri: 'https://flexible.img.hani.co.kr/flexible/normal/970/777/imgdb/resize/2019/0926/00501881_20190926.JPG' } },
    { id: 7, name: 'Product 7', image: { uri: 'https://e7.pngegg.com/pngimages/298/457/png-clipart-red-circle-button-miscellaneous-button-png.png' } },
    { id: 8, name: 'Product 8', image: { uri: 'https://flexible.img.hani.co.kr/flexible/normal/970/777/imgdb/resize/2019/0926/00501881_20190926.JPG' } },
    { id: 9, name: 'Product 9', image: { uri: 'https://e7.pngegg.com/pngimages/298/457/png-clipart-red-circle-button-miscellaneous-button-png.png' } },
  ];

  // 상품을 선택했을 때 실행되는 함수 (상품 선택 시 모달을 띄우고, 선택한 상품 정보를 설정)
  const handleProductSelect = (productName: string) => {
    // TTS 메시지 생성 및 재생 (상품 선택 안내 메시지를 사용자에게 음성으로 안내)
    const ttsMessage = `${productName}을 선택하셨습니다. 원하시는 작업을 선택해주세요: 구매는 YES(파란색), 취소는 NO(노란색), 수량 증가를 원하면 +(초록색), 수량 감소를 원하면 -(빨간색) 버튼을 눌러주세요.`;
    const speech = new window.SpeechSynthesisUtterance(ttsMessage);
    window.speechSynthesis.speak(speech);
    // 선택된 상품 설정 및 이전 수량 저장 (상품을 선택할 때 현재 수량을 저장하여 나중에 변경 가능)
    setSelectedProduct(productName);
    setPreviousProductCount(productCounts[productName] || 0);
    setIsProductModalVisible(true);
  };

  // 장바구니 모달에서의 액션 처리 함수 (장바구니에서 특정 동작을 했을 때 안내 메시지 재생)
  const handleCartModalAction = (actionName: string) => {
    // TTS 메시지 생성 및 재생 (장바구니 내의 특정 액션에 대해 사용자에게 음성으로 안내)
    const ttsMessage = `${actionName}을 클릭하셨습니다.`;
    const speech = new window.SpeechSynthesisUtterance(ttsMessage);
    window.speechSynthesis.speak(speech);
  };

  // 결제 과정을 처리하는 함수 (사용자가 결제를 진행할 때 호출되는 함수)
  const handlePaymentProcess = () => {
    // 결제 진행 중임을 알리는 TTS 메시지 생성 및 재생 (결제 과정에서 기다려달라는 안내)
    const paymentMessage = "결제가 진행중입니다. 잠시만 기다려 주세요";
    const paymentSpeech = new window.SpeechSynthesisUtterance(paymentMessage);
    window.speechSynthesis.speak(paymentSpeech);
    setIsPaymentInProgress(true);
    setIsProductModalVisible(false);
    setIsCartModalVisible(false);
    setIsPaymentModalVisible(true);
    // 10초 후 결제 완료 처리 (결제 과정이 10초 후에 완료된다는 가정하에 처리)
    setTimeout(() => {
      const completionMessage = "결제가 완료되었습니다";
      const completionSpeech = new window.SpeechSynthesisUtterance(completionMessage);
      window.speechSynthesis.speak(completionSpeech);
      // 상태 초기화 및 초기 화면으로 복귀 (결제가 완료되면 상태를 초기화하여 초기 화면으로 돌아감)
      setProductCounts({});
      setSelectedProduct('');
      setIsPaymentInProgress(false);
      setIsPaymentModalVisible(false);
    }, 10000);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 상품 목록을 스크롤 가능한 뷰로 렌더링 */}
      <ScrollView contentContainerStyle={styles.container}>
        {products.map((product) => (
          // 상품 버튼 렌더링 (각 상품을 터치 가능 버튼으로 표시하며, 선택 시 handleProductSelect 호출)
          <TouchableOpacity key={product.id} style={styles.productButton} onPress={() => handleProductSelect(product.name)}>
            <Image source={product.image} style={styles.productImage} />
            <Text style={styles.productName}>{product.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.cartFooter}>
        {/* 장바구니에 담긴 상품 목록을 수평 스크롤로 표시 */}
        <ScrollView horizontal contentContainerStyle={styles.cartFooterContainer} showsHorizontalScrollIndicator={false}>
          {Object.keys(productCounts).map((key) =>
            productCounts[key] > 0 ? (
              <View key={key} style={styles.cartFooterItem}>
                <Text style={styles.cartFooterText}>{key} * {productCounts[key]}</Text>
                <Pressable
                  style={[styles.counterButton, styles.decrementButton]}
                  onPress={() => {
                    // 상품 제거 처리 및 TTS 메시지 재생 (사용자가 장바구니에서 상품을 제거할 때 실행)
                    setProductCounts((prevProductCounts) => {
                      const updatedCounts = { ...prevProductCounts };
                      delete updatedCounts[key];
                      return updatedCounts;
                    });
                    const ttsMessage = `${key} 항목이 제거되었습니다`;
                    const speech = new window.SpeechSynthesisUtterance(ttsMessage);
                    window.speechSynthesis.speak(speech);
                  }}
                >
                  <Text style={styles.buttonText}>-</Text>
                </Pressable>
              </View>
            ) : null
          )}
        </ScrollView>
      </View>
      {/* 결제 버튼 */}
      <TouchableOpacity style={styles.checkoutButton} onPress={() => {
          setIsCartModalVisible(true);
          // 장바구니에 있는 상품 목록 안내 TTS 메시지 생성 및 재생 (사용자에게 현재 장바구니 상태를 음성으로 안내)
          const infoTTSMessage = Object.keys(productCounts).length > 0
            ? Object.keys(productCounts).map((key) => productCounts[key] > 0 ? `${key}를 ${productCounts[key]}개 선택하셨습니다.` : '').filter(Boolean).join(' ')
            : '선택된 항목이 없습니다.';
          const infoSpeech = new window.SpeechSynthesisUtterance(infoTTSMessage);
          window.speechSynthesis.speak(infoSpeech);
          const cartMessage = `결제하기를 원하실경우 결제하기버튼(연두색)을 클릭하여주세요. 장바구니를 나가기를 원하실경우 취소버튼(빨간색)을 클릭하여주세요.`;
          const cartSpeech = new window.SpeechSynthesisUtterance(cartMessage);
          window.speechSynthesis.speak(cartSpeech);
        }}>
        <Text style={styles.checkoutButtonText}>결제하기</Text>
      </TouchableOpacity>
      {/* 상품 모달 (사용자가 특정 상품을 선택했을 때 나타나는 모달) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isProductModalVisible}
        onRequestClose={() => {
          setIsProductModalVisible(!isProductModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedProduct}</Text>
            <Text style={styles.modalTitle}> 얼마나 구매하시겠습니까?</Text>
            <View style={styles.counterContainer}>
              {/* 수량 감소 버튼 (현재 선택된 상품의 수량을 감소) */}
              <Pressable
                style={[styles.counterButton, styles.decrementButton]}
                onPress={() => {
                  handleCartModalAction('Minus');
                  setProductCounts((prevProductCounts) => {
                    const newCount = Math.max((prevProductCounts[selectedProduct] || 0) - 1, 0);
                    const updatedCounts = {
                      ...prevProductCounts,
                      [selectedProduct]: newCount,
                    };
                    const ttsMessage = `${selectedProduct} 수량은 현재 ${newCount}개 입니다.`;
                    const speech = new window.SpeechSynthesisUtterance(ttsMessage);
                    window.speechSynthesis.speak(speech);
                    return updatedCounts;
                  });
                }}
              >
                <Text style={styles.buttonText}>-</Text>
              </Pressable>
              {/* 현재 수량 표시 (현재 선택된 상품의 수량을 텍스트로 표시) */}
              <Text style={styles.counterText}>{productCounts[selectedProduct] || 0}</Text>
              {/* 수량 증가 버튼 (현재 선택된 상품의 수량을 증가) */}
              <Pressable
                style={[styles.counterButton, styles.incrementButton]}
                onPress={() => {
                  handleCartModalAction('Plus');
                  setProductCounts((prevProductCounts) => {
                    const newCount = (prevProductCounts[selectedProduct] || 0) + 1;
                    const updatedCounts = {
                      ...prevProductCounts,
                      [selectedProduct]: newCount,
                    };
                    const ttsMessage = `현재 ${selectedProduct}의 수량은 ${newCount}개 입니다.`;
                    const speech = new window.SpeechSynthesisUtterance(ttsMessage);
                    window.speechSynthesis.speak(speech);
                    return updatedCounts;
                  });
                }}
              >
                <Text style={styles.buttonText}>+</Text>
              </Pressable>
            </View>
            <View style={styles.modalButtonContainer}>
              {/* 취소 버튼 (선택한 상품을 장바구니에 추가하지 않고 모달을 닫음) */}
              <Pressable
                style={[styles.modalActionButton, styles.productCancelButton]}
                onPress={() => {
                  handleCartModalAction('취소');
                  setIsProductModalVisible(!isProductModalVisible);
                  setProductCounts((prevProductCounts) => ({
                    ...prevProductCounts,
                    [selectedProduct]: previousProductCount,
                  }));
                  setSelectedProduct('');
                }}
              >
                <Text style={styles.buttonText}>취소</Text>
              </Pressable>
              {/* 장바구니에 추가 버튼 (선택한 수량만큼 상품을 장바구니에 추가하고 모달을 닫음) */}
              <Pressable
                style={[styles.modalActionButton, styles.addToCartButton]}
                onPress={() => {
                  handleCartModalAction('담기');
                  setIsProductModalVisible(!isProductModalVisible);
                  setSelectedProduct('');
                }}
              >
                <Text style={styles.buttonText}>담기</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* 장바구니 모달 (사용자가 결제를 진행하기 전 장바구니를 확인하는 화면) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCartModalVisible}
        onRequestClose={() => {
          setIsCartModalVisible(!isCartModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>장바구니</Text>
            {isPaymentInProgress ? (
              // 결제 진행 중인 경우 결제 진행 메시지 표시
              <Text style={styles.modalTitle}>결제가 진행중입니다</Text>
            ) : Object.keys(productCounts).length > 0 ? (
              // 장바구니에 상품이 있는 경우 상품 목록을 표시
              <View style={styles.cartContentContainer}>
                {Object.keys(productCounts).map((key) =>
                  productCounts[key] > 0 ? (
                    <View key={key} style={styles.cartFooterItem}>
                      <Text style={styles.cartContentText}>{key} * {productCounts[key]}</Text>
                    </View>
                  ) : null
                )}
              </View>
            ) : (
              // 장바구니가 비어 있는 경우 비어 있다는 메시지 표시
              <Text style={styles.cartContentText}>비어 있음</Text>
            )}
            <View style={styles.modalButtonContainer}>
              {/* 장바구니 취소 버튼 (장바구니 화면을 닫음) */}
              <Pressable
                style={[styles.modalActionButton, styles.cartCancelButton]}
                onPress={() => {
                  handleCartModalAction('취소');
                  setIsCartModalVisible(!isCartModalVisible);
                }}
              >
                <Text style={styles.buttonText}>취소</Text>
              </Pressable>
              {/* 결제 진행 버튼 (결제를 시작하고 결제 모달을 띄움) */}
              <Pressable
                style={[styles.modalActionButton, styles.proceedToPaymentButton]}
                onPress={() => {
                  handlePaymentProcess();
                }}
              >
                <Text style={styles.buttonText}> 결제하기</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* 결제 모달 (결제 진행 중일 때 사용자에게 진행 상황을 표시하는 화면) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPaymentModalVisible}
        onRequestClose={() => {
          setIsPaymentModalVisible(!isPaymentModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>결제가 진행중입니다</Text>
            <ActivityIndicator size="large" color="#0000ff" style={styles.spinner} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // 스타일 정의 (각 컴포넌트의 스타일을 정의)
  cartFooterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  cartFooterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  cartFooter: {
    flexDirection: 'row',
    paddingVertical: 10,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartFooterText: { 
    color: 'white',
    fontSize: 16,
    marginVertical: 2,
  },
  cartContentText: {
    color: 'black',
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
  productButton: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.5%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  productImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
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
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalActionButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    minWidth: 100,
    alignItems: 'center',
  },
  productCancelButton: {
    backgroundColor: '#fff700',
  },
  cartCancelButton: {
    backgroundColor: '#f44336',
    marginTop: 20,
  },
  addToCartButton: {
    backgroundColor: '#0000FF',
  },
  buttonText: {
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
  decrementButton: {
    backgroundColor: '#f44336',
  },
  incrementButton: {
    backgroundColor: '#4CAF50',
  },
  counterText: {
    fontSize: 20,
    marginHorizontal: 20,
  },
  checkoutButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#008080',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  cartContentContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  proceedToPaymentButton: {
    backgroundColor: '#32CD32',
    marginTop: 20,
  },
  spinner: {
    marginTop: 20,
  },
});

export default KioskApp;
