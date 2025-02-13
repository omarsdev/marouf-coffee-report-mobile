import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {twMerge} from 'tailwind-merge';
import {useQuery} from '@tanstack/react-query';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import BottomSheet from '@gorhom/bottom-sheet';

import HeaderComponents from '@/components/HeaderComponents';
import ContainerComponents from '@/components/container/ContainerComponents';
import {normalize} from '@/utils';
import CustomButton from '@/components/custom/CustomButton';
import useDateStore from '@/store/useDateStore';
import CustomLoadingProvider from '@/components/custom/CustomLoadingProvider';
import {assignmentsAPI} from '@/api/assignments';
import {submissionsAPI} from '@/api/submissions';
import AddNoteComponents from './components/AddNoteComponents';

const TASKS_COLORS = [
  {bg: 'bg-[#FFF5D5]', btn: 'bg-[#F9E5A3]'},
  {bg: 'bg-[#A8D0E680]', btn: 'bg-[#A8D0E6]'},
  {bg: 'bg-[#D3A9E380]', btn: 'bg-[#D3A9E3]'},
  {bg: 'bg-[#B9E0D480]', btn: 'bg-[#B9E0D4]'},
];

const ReportScreen = () => {
  const navigation = useNavigation();
  const {params} = useRoute();

  const {selectedBranch} = useDateStore();
  const isFocused = useIsFocused();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const [body, setBody] = useState({});
  const [selectedNote, setSelectedNote] = useState(null);

  const {data, isLoading} = useQuery({
    queryFn: () => assignmentsAPI.getById(params?.assignmentId),
    queryKey: ['reportsById' + params?.assignmentId],
    subscribed: isFocused,
  });

  const isDisabled = useMemo(
    () =>
      data?.assignment?.reportId?.questions?.length !==
        Object.values(body).length ||
      Object.values(body)?.find(e => !e?.answer),
    [data, body],
  );

  const onSubmitHandler = async () => {
    try {
      const answersPayload = Object.values(body).map(e => ({
        questionId: e?.questionId,
        answer: e?.answer,
        note: e?.note ? JSON.stringify(e?.note) : 'Empty',
      }));
      const payload = {
        reportId: data?.assignment?.reportId?._id,
        answers: answersPayload,
        assignmentId: data?.assignment?._id,
      };
      const res = await submissionsAPI.create(payload);
      navigation.goBack();
    } catch (error) {}
  };

  const onCreate = async (type, question) => {
    if (!question?._id) return; // Ensure question is valid

    const {_id: questionId} = question;
    const key = type === 'Yes' || type === 'No' ? 'answer' : 'note';

    const newBody = {questionId, [key]: type};

    setBody(prevState => ({
      ...prevState,
      [questionId]: {
        ...prevState[questionId],
        ...newBody,
      },
    }));
  };

  const onNotePressHandler = question => {
    setSelectedNote(question);
  };

  useEffect(() => {
    if (!selectedNote) {
      return;
    }
    bottomSheetRef.current?.expand();
  });

  return (
    <SafeAreaView className="flex-1">
      <ContainerComponents>
        <HeaderComponents />

        <CustomLoadingProvider loading={isLoading}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {selectedBranch?.name && (
              <View className="mt-7 gap-3">
                <Text className="font-poppins text-lg font-normal leading-6 text-left">
                  Branch Name
                </Text>
                <View className="p-5 flex-row gap-4 bg-[#F3F3F3] rounded-2xl">
                  <EvilIcons name="location" size={22} color={'#000'} />
                  <Text className="font-poppins text-lg font-normal leading-6 text-left">
                    {selectedBranch?.name?.en}
                  </Text>
                </View>
              </View>
            )}

            <View className="mt-7">
              <View className="flex-row gap-3 items-center">
                <Fontisto name="fire" size={20} />
                <Text className="font-poppins text-lg font-normal leading-6 text-left">
                  Report "{data?.assignment?.reportId?.title}"
                </Text>
              </View>
              <View className="mt-3 h-[5px] bg-[#AEAEAE] w-full relative rounded-3xl">
                <View className="absolute z-10 left-0 top-0 bottom-0 w-1/2 bg-black rounded-3xl" />
              </View>
              <View className="gap-4 pt-7">
                {data?.assignment?.reportId?.questions?.map(
                  (question, questionIndex) => {
                    const {bg, btn} = TASKS_COLORS[questionIndex % 2];
                    const {answer, note} = body[question?._id] ?? {};

                    return (
                      <View
                        className={twMerge(
                          'py-4 px-2 flex-col justify-between rounded-xl',
                          bg,
                          answer && 'border-[1px]',
                        )}
                        key={questionIndex}>
                        <Text className="font-poppins text-lg font-normal leading-6 text-left">
                          {question?.text}
                        </Text>
                        <View className="flex-row gap-5 justify-end mt-3">
                          <TouchableOpacity
                            onPress={() => onCreate('Yes', question)}
                            className={twMerge(
                              'px-3 py-[6px] rounded-3xl',
                              btn,
                              answer === 'Yes' && 'border-[1px]',
                            )}>
                            <Text
                              className="font-poppins font-normal"
                              style={{fontSize: normalize(16)}}>
                              Yes
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => onCreate('No', question)}
                            className={twMerge(
                              'bg-[#F9A3A3] px-3 py-[6px] rounded-3xl',
                              answer === 'No' && 'border-[1px]',
                            )}>
                            <Text
                              className="font-poppins font-normal"
                              style={{fontSize: normalize(16)}}>
                              No
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            disabled={!answer}
                            onPress={() => onNotePressHandler(question)}
                            className={twMerge(
                              'px-3 py-[6px] rounded-3xl',
                              btn,
                              note && 'border-[1px]',
                              !answer && 'opacity-50',
                            )}>
                            <Text
                              className="font-poppins font-normal"
                              style={{fontSize: normalize(16)}}>
                              Add Note
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  },
                )}
              </View>
            </View>

            <CustomButton
              className="mt-7"
              title="Submit"
              disabled={isDisabled}
              onPress={onSubmitHandler}
            />
          </ScrollView>
        </CustomLoadingProvider>
      </ContainerComponents>
      <AddNoteComponents
        ref={bottomSheetRef}
        selectedNote={selectedNote}
        setSelectedNote={setSelectedNote}
        setBody={setBody}
        onCreate={onCreate}
        body={body}
      />
    </SafeAreaView>
  );
};

export default ReportScreen;
