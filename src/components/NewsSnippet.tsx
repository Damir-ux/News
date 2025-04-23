import React, { useCallback, useMemo } from "react";
import "../styles/NewsSnippet.scss";
import {
  GlobalOutlined,
  UserOutlined,
  FlagOutlined,
  TranslationOutlined,
  InfoCircleOutlined,
  TagOutlined,
  CaretDownFilled,
  DownOutlined,
} from "@ant-design/icons";
import { Button, Popover, Dropdown, Menu } from "antd";
import { IData_SnippetNews } from "../types/types";
import { format } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { toggleExpanded, setFilter, toggleDuplicates, toggleTags } from "../store/newsSnippetSlice";

interface Props {
  data: IData_SnippetNews;
  showDivider?: boolean;
}

export const NewsSnippet = React.memo(({ data }: Props) => {
  const dispatch = useDispatch();
  const { expanded, filter, showDuplicates, showAllTags } = useSelector(
    (state: RootState) => state.newsSnippet
  );

  const formattedDate = useMemo(() => format(new Date(data.DP), "dd MMM yyyy"), [data.DP]);

  const highlightKeywords = useCallback((text: string, keywords: string[]) => {
    if (!keywords || keywords.length === 0) return text;
    const escaped = keywords.map((kw) => kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const regex = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
    return text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
  }, []);

  const highlightedText = useMemo(
    () =>
      highlightKeywords(
        data.HIGHLIGHTS.join(" "),
        data.KW.map((kw) => kw.value)
      ),
    [data.HIGHLIGHTS, data.KW, highlightKeywords]
  );

  const infoContent = useMemo(
    () => (
      <div>
        <p>
          <strong>Sentiment:</strong> {data.SENT}
        </p>
        <p>
          <strong>Reach:</strong> {data.REACH}
        </p>
        <p>
          <strong>Country:</strong> {data.CNTR}
        </p>
      </div>
    ),
    [data]
  );

  const onToggleExpanded = useCallback(() => dispatch(toggleExpanded()), [dispatch]);
  const onToggleDuplicates = useCallback(() => dispatch(toggleDuplicates()), [dispatch]);
  const onToggleTags = useCallback(() => dispatch(toggleTags()), [dispatch]);
  const onFilterChange = useCallback(
    ({ key }: { key: string }) => dispatch(setFilter(key)),
    [dispatch]
  );

  const filterMenu = (
    <Menu onClick={onFilterChange}>
      <Menu.Item key="By Relevance">By Relevance</Menu.Item>
      <Menu.Item key="By Date">By Date</Menu.Item>
      <Menu.Item key="By Reach">By Reach</Menu.Item>
    </Menu>
  );

  return (
    <div className="news-card">
      <div className="header">
        <div className="header-left">
          <div className="date-reach">
            <span className="date">
              <span className="light-text">{formattedDate}</span>
            </span>
            <span className="reach">
              <span className="light-text">{data.REACH}</span> Reach
            </span>
          </div>

          {data.TRAFFIC && data.TRAFFIC.length > 0 && (
            <div className="traffic">
              Top Traffic:{" "}
              {data.TRAFFIC.map((item, index) => (
                <span key={index}>
                  {item.value}{" "}
                  <span className="traffic-percent">{(item.count * 100).toFixed(0)}%</span>
                  {index < data.TRAFFIC.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="sentiment-wrapper">
          <div className={`sentiment ${data.SENT.toLowerCase()}`}>{data.SENT}</div>
          <Popover content={infoContent} title="More info">
            <InfoCircleOutlined className="info-icon" />
          </Popover>
          <label className="checkbox-label">
            <input type="checkbox" className="sentiment-checkbox" />
          </label>
        </div>
      </div>

      <h2 className="title">{data.TI}</h2>

      <div className="meta">
        <GlobalOutlined />
        <a href={data.URL} target="_blank" rel="noopener noreferrer" className="domain">
          {data.DOM}
        </a>

        <FlagOutlined />
        <span>{data.CNTR}</span>

        <TranslationOutlined />
        <span>{data.LANG.toUpperCase()}</span>

        <UserOutlined />
        <span>{data.AU.join(", ")}</span>
      </div>

      <div
        className={`content ${expanded ? "expanded" : ""}`}
        dangerouslySetInnerHTML={{
          __html: expanded ? highlightedText : highlightedText.slice(0, 250) + "...",
        }}
      />

      <Button type="link" className="toggle" onClick={onToggleExpanded}>
        {expanded ? "Show less" : "Show more"}
        <CaretDownFilled className={`arrow-icon ${expanded ? "rotated" : ""}`} />
      </Button>

      <div className="tags">
        {(showAllTags ? data.KW : data.KW.slice(0, 6)).map((tag, index) => (
          <span key={index} className="tag">
            <TagOutlined className="tag-icon" />
            {tag.value} {tag.count}
          </span>
        ))}
        {data.KW.length > 6 && (
          <Button type="link" className="show-tags-button" onClick={onToggleTags}>
            {showAllTags ? "Show less" : `Show all +${data.KW.length - 6}`}
          </Button>
        )}
      </div>

      <div className="original-source-wrapper">
        <Button className="original-source-button" type="default" href={data.URL} target="_blank">
          Original Source
        </Button>
      </div>

      <div className="duplicates-footer">
        <div className="duplicates-count">Duplicates: {data.DUPLICATES || 0}</div>
        <div className="filter-container">
          <Dropdown overlay={filterMenu} trigger={["click"]}>
            <Button className="filter-button">
              <div /> {filter} <DownOutlined /> <div />
            </Button>
          </Dropdown>
        </div>
      </div>

      {showDuplicates && (
        <div className="duplicates-card">
          <div className="duplicate-entry">
            <div className="duplicate-header">
              <div className="duplicate-main">
                <div className="duplicate-date">{formattedDate}</div>
                <div className="duplicate-text">{data.REACH} Top Reach</div>
              </div>
              <div className="gap">
                <Popover content={infoContent} title="More info">
                  <InfoCircleOutlined className="info-icon" />
                </Popover>
                <label className="checkbox-label">
                  <input type="checkbox" className="sentiment-checkbox" />
                </label>
              </div>
            </div>
            <div className="duplicate-title">{data.TI}</div>
            <div className="duplicate-meta">
              <GlobalOutlined />
              <a
                href={data.URL}
                target="_blank"
                rel="noopener noreferrer"
                className="duplicate-domain"
              >
                {data.DOM}
              </a>
              <FlagOutlined />
              <span>{data.CNTR}</span>
              <UserOutlined />
              <span>{data.AU.join(", ")}</span>
            </div>
          </div>
        </div>
      )}

      <Button type="link" className="view-duplicates" onClick={onToggleDuplicates}>
        {showDuplicates ? "Hide Duplicates" : "View Duplicates"} <DownOutlined />
      </Button>
    </div>
  );
});
